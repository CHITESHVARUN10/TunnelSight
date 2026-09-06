from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.core.session import cookie_kwargs, create_session, destroy_session
from app.models.password_reset import PasswordReset
from app.models.profile import Profile
from app.models.session import Session as SessionModel
from app.models.user import User
from app.schemas.profile import ChangePasswordIn, ForgotPasswordIn, ResetPasswordIn
from app.schemas.user import LoginIn, RegisterIn, UserOut

router = APIRouter()

RESET_TTL_HOURS = 1


@router.post("/register", response_model=UserOut)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        from fastapi import HTTPException

        raise HTTPException(status_code=400, detail="email already registered")
    if len(data.password) < 8:
        from fastapi import HTTPException

        raise HTTPException(status_code=400, detail="password must be >= 8 chars")
    user = User(email=data.email.lower(), password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    db.add(Profile(user_id=user.id))
    db.commit()
    return user


@router.post("/login", response_model=UserOut)
def login(data: LoginIn, response: Response, db: Session = Depends(get_db)):
    from fastapi import HTTPException

    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")
    sess = create_session(db, user.id)
    response.set_cookie(settings.SESSION_COOKIE_NAME, sess.id, max_age=settings.SESSION_EXPIRE_DAYS * 86400, **cookie_kwargs())
    return user


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if token:
        destroy_session(db, token)
    response.delete_cookie(settings.SESSION_COOKIE_NAME, path="/")
    return {"status": "logged-out"}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/change-password")
def change_password(data: ChangePasswordIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from fastapi import HTTPException

    if not verify_password(data.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="current password is incorrect")
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="password must be >= 8 chars")
    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"status": "password-changed"}


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordIn, db: Session = Depends(get_db)):
    import hashlib
    import secrets
    from datetime import datetime, timedelta, timezone

    # Always 200 to avoid email enumeration. Dev mode returns the token
    # (no SMTP in this phase; wire email sending later).
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if user:
        raw = secrets.token_urlsafe(32)
        digest = hashlib.sha256(raw.encode()).hexdigest()
        db.add(
            PasswordReset(
                user_id=user.id,
                token_hash=digest,
                expires_at=datetime.now(timezone.utc) + timedelta(hours=RESET_TTL_HOURS),
            )
        )
        db.commit()
        return {"status": "ok", "dev_token": raw}
    return {"status": "ok"}


@router.post("/reset-password")
def reset_password(data: ResetPasswordIn, db: Session = Depends(get_db)):
    import hashlib
    from datetime import datetime, timezone

    from fastapi import HTTPException

    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="password must be >= 8 chars")
    digest = hashlib.sha256(data.token.encode()).hexdigest()
    row = db.query(PasswordReset).filter(PasswordReset.token_hash == digest).first()
    now = datetime.now(timezone.utc)
    expires = row.expires_at if row else None
    if expires is not None and expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if not row or row.used_at is not None or (expires is not None and expires < now):
        raise HTTPException(status_code=400, detail="invalid or expired token")
    user = db.get(User, row.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="invalid or expired token")
    user.password_hash = hash_password(data.new_password)
    row.used_at = now
    # Invalidate all sessions after a reset.
    db.query(SessionModel).filter(SessionModel.user_id == user.id).delete()
    db.commit()
    return {"status": "password-reset"}
