import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def run():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        print("Checking/Adding folder_id to audit_logs...")
        try:
            # First check if it already exists to be safe
            check_sql = text("ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL")
            await conn.execute(check_sql)
            print("Successfully added folder_id column to audit_logs table.")
            # Also add the index for performance
            idx_sql = text("CREATE INDEX IF NOT EXISTS ix_audit_logs_folder_id ON audit_logs (folder_id)")
            await conn.execute(idx_sql)
            print("Successfully created index ix_audit_logs_folder_id.")
        except Exception as e:
            print(f"Failed to add column/index: {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run())
