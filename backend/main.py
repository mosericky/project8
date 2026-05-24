import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from database import pool

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Verify Database Connection on startup
    await pool.open()
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT version()")
                version = await cur.fetchone()
                print(f"Connected to PostgreSQL: {version[0]}")
    except Exception as error:
        print(f"Failed to connect to database: {error}")
        # Exit the application if database connection fails, matching Bun.exit(1)
        os._exit(1)
    
    yield
    # Clean up the connection pool on shutdown
    await pool.close()

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status": "ok", "db": "connected"}

@app.get("/", response_class=PlainTextResponse)
async def root():
    return "Style Hub Backend is running!"

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    print(f"Style Hub Backend running at http://localhost:{port}")
    # Run the server using uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)