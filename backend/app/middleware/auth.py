from fastapi import Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database import get_db


async def verify_better_auth_token(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = auth_header.replace("Bearer ", "")

    result = await db.execute(
        text(
            'SELECT s."userId", u.email FROM session s '
            'JOIN "user" u ON u.id = s."userId" '
            'WHERE s.token = :token AND s."expiresAt" > NOW()'
        ),
        {"token": token},
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    request.state.user_id = row[0]
    request.state.email = row[1]
