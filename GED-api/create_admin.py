import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.user import User, RoleEnum
from app.core.security import get_password_hash
from app.core.database import Base

async def create_init_user():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        async with session.begin():
            # Check if admin already exists
            result = await session.execute(select(User).filter(User.email == "admin@ged.com"))
            admin = result.scalars().first()
            if not admin:
                print("Creating default admin user...")
                admin = User(
                    email="admin@ged.com",
                    hashed_password=get_password_hash("password"),
                    full_name="Administrator",
                    role=RoleEnum.ADMIN
                )
                session.add(admin)
                print("Default admin user created: admin@ged.com / password")
            else:
                print("Admin user already exists.")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(create_init_user())
