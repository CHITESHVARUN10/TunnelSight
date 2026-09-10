"""Create all tables. Run from backend/ dir: python -m app.db.init_db"""

from app.db.base import Base, engine

# Import models so they register on Base.metadata
import app.models.user  # noqa: F401
import app.models.session  # noqa: F401
import app.models.analysis  # noqa: F401
import app.models.analysis_window  # noqa: F401
import app.models.password_reset  # noqa: F401
import app.models.profile  # noqa: F401


def main() -> None:
    Base.metadata.create_all(bind=engine)
    print("tables created")


if __name__ == "__main__":
    main()
