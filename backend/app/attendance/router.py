from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timezone, timedelta
from typing import Optional
from uuid import UUID
import math

from app.database.session import get_db
from app.models.models import User, Attendance
from app.core.security import get_current_user, require_admin
from app.schemas.schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def check_in(
    payload: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record gym check-in."""
    target_user_id = payload.user_id if (current_user.role.value == "admin" and payload.user_id) else current_user.id

    # Check if already checked in today
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    existing = await db.execute(
        select(Attendance).where(
            and_(
                Attendance.user_id == target_user_id,
                Attendance.check_in >= today_start,
                Attendance.check_out.is_(None),
            )
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already checked in. Please check out first.",
        )

    record = Attendance(
        user_id=target_user_id,
        check_in=datetime.now(timezone.utc),
        notes=payload.notes,
    )
    db.add(record)
    await db.flush()
    return record


@router.post("/{attendance_id}/check-out", response_model=AttendanceResponse)
async def check_out(
    attendance_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record gym check-out and calculate session duration."""
    result = await db.execute(select(Attendance).where(Attendance.id == attendance_id))
    record = result.scalar_one_or_none()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found.")

    # Permission check
    if current_user.role.value != "admin" and str(record.user_id) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    if record.check_out:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already checked out.")

    check_out_time = datetime.now(timezone.utc)
    duration = int((check_out_time - record.check_in).total_seconds() / 60)

    record.check_out = check_out_time
    record.duration_minutes = duration
    db.add(record)
    return record


@router.get("/", response_model=dict)
async def list_attendance(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user_id: Optional[UUID] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List attendance records. Admins can see all; users see their own."""
    query = select(Attendance)

    if current_user.role.value == "admin":
        if user_id:
            query = query.where(Attendance.user_id == user_id)
    else:
        query = query.where(Attendance.user_id == current_user.id)

    if date_from:
        query = query.where(Attendance.check_in >= date_from)
    if date_to:
        query = query.where(Attendance.check_in <= date_to)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    query = query.order_by(Attendance.check_in.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    records = result.scalars().all()

    return {
        "items": [AttendanceResponse.model_validate(r) for r in records],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total / per_page),
    }


@router.get("/stats/me")
async def my_attendance_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get attendance stats for the current user."""
    now = datetime.now(timezone.utc)
    week_start = now - timedelta(days=now.weekday())
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total = await db.scalar(select(func.count(Attendance.id)).where(Attendance.user_id == current_user.id))
    this_week = await db.scalar(
        select(func.count(Attendance.id)).where(
            and_(Attendance.user_id == current_user.id, Attendance.check_in >= week_start)
        )
    )
    this_month = await db.scalar(
        select(func.count(Attendance.id)).where(
            and_(Attendance.user_id == current_user.id, Attendance.check_in >= month_start)
        )
    )
    avg_duration = await db.scalar(
        select(func.avg(Attendance.duration_minutes)).where(
            and_(Attendance.user_id == current_user.id, Attendance.duration_minutes.isnot(None))
        )
    )

    return {
        "total_visits": total or 0,
        "this_week": this_week or 0,
        "this_month": this_month or 0,
        "avg_duration_minutes": round(avg_duration or 0),
    }
