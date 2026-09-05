from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.core.session import cookie_kwargs, create_session, destroy_session
from app.models.user import User
from app.schemas.user import LoginIn, RegisterIn, UserOut

router = APIRouter()


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
