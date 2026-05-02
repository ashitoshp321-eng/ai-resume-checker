import json
from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    screenings: Mapped[list["Screening"]] = relationship(
        "Screening", back_populates="job_description", cascade="all, delete-orphan"
    )


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    _parsed_json: Mapped[str] = mapped_column(
        "parsed_json", Text, nullable=False, default="{}"
    )
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    screenings: Mapped[list["Screening"]] = relationship(
        "Screening", back_populates="resume", cascade="all, delete-orphan"
    )

    @property
    def parsed_json(self) -> dict:
        try:
            return json.loads(self._parsed_json)
        except (json.JSONDecodeError, TypeError):
            return {}

    @parsed_json.setter
    def parsed_json(self, value: dict) -> None:
        self._parsed_json = json.dumps(value)


class Screening(Base):
    __tablename__ = "screenings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    jd_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False
    )
    resume_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False
    )
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    rank: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    screened_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    job_description: Mapped["JobDescription"] = relationship(
        "JobDescription", back_populates="screenings"
    )
    resume: Mapped["Resume"] = relationship("Resume", back_populates="screenings")
