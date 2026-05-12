from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timezone, timedelta

from app.database.session import get_db
from app.models.models import User, Membership, Attendance, Payment, MembershipStatus, PaymentStatus
from app.core.security import require_admin
from app.schemas.schemas import DashboardStats

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardStats)
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Comprehensive dashboard stats for admin panel."""
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    prev_month_start = (month_start - timedelta(days=1)).replace(day=1)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    expiry_threshold = now + timedelta(days=7)

    # Members
    total_members = await db.scalar(
        select(func.count(User.id)).where(User.role == "user", User.deleted_at.is_(None))
    ) or 0

    active_members = await db.scalar(
        select(func.count(User.id)).where(
            User.role == "user", User.is_active == True, User.deleted_at.is_(None)
        )
    ) or 0

    new_members_this_month = await db.scalar(
        select(func.count(User.id)).where(
            User.role == "user",
            User.created_at >= month_start,
            User.deleted_at.is_(None),
        )
    ) or 0

    # Revenue
    total_revenue = await db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0)).where(
            Payment.status == PaymentStatus.completed
        )
    ) or 0.0

    revenue_this_month = await db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0)).where(
            and_(Payment.status == PaymentStatus.completed, Payment.paid_at >= month_start)
        )
    ) or 0.0

    revenue_prev_month = await db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0)).where(
            and_(
                Payment.status == PaymentStatus.completed,
                Payment.paid_at >= prev_month_start,
                Payment.paid_at < month_start,
            )
        )
    ) or 0.0

    revenue_growth = (
        ((revenue_this_month - revenue_prev_month) / revenue_prev_month * 100)
        if revenue_prev_month > 0
        else 0.0
    )

    # Attendance
    total_check_ins = await db.scalar(select(func.count(Attendance.id))) or 0

    check_ins_today = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.check_in >= today_start)
    ) or 0

    # Memberships
    active_memberships = await db.scalar(
        select(func.count(Membership.id)).where(
            Membership.status == MembershipStatus.active
        )
    ) or 0

    expiring_soon = await db.scalar(
        select(func.count(Membership.id)).where(
            and_(
                Membership.status == MembershipStatus.active,
                Membership.end_date <= expiry_threshold,
                Membership.end_date > now,
            )
        )
    ) or 0

    return DashboardStats(
        total_members=total_members,
        active_members=active_members,
        new_members_this_month=new_members_this_month,
        total_revenue=float(total_revenue),
        revenue_this_month=float(revenue_this_month),
        revenue_growth=round(revenue_growth, 2),
        total_check_ins=total_check_ins,
        check_ins_today=check_ins_today,
        active_memberships=active_memberships,
        expiring_soon=expiring_soon,
    )


@router.get("/revenue/monthly")
async def monthly_revenue(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Revenue aggregated by month for the current year."""
    year = datetime.now(timezone.utc).year
    result = await db.execute(
        select(
            func.to_char(Payment.paid_at, "Mon").label("month"),
            func.extract("month", Payment.paid_at).label("month_num"),
            func.sum(Payment.amount).label("revenue"),
            func.count(Payment.id).label("transaction_count"),
        ).where(
            and_(
                Payment.status == PaymentStatus.completed,
                func.extract("year", Payment.paid_at) == year,
            )
        ).group_by("month", "month_num").order_by("month_num")
    )
    rows = result.all()

    return [
        {
            "month": row.month,
            "revenue": float(row.revenue or 0),
            "transaction_count": row.transaction_count,
        }
        for row in rows
    ]


@router.get("/attendance/weekly")
async def weekly_attendance(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Check-in counts for the past 7 days."""
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(
            func.date(Attendance.check_in).label("date"),
            func.count(Attendance.id).label("count"),
        ).where(
            Attendance.check_in >= now - timedelta(days=7)
        ).group_by("date").order_by("date")
    )

    return [{"date": str(row.date), "count": row.count} for row in result.all()]
