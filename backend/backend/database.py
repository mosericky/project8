import os
from psycopg_pool import AsyncConnectionPool
from dotenv import load_dotenv

load_dotenv()

def get_connection_string():
    # Check for DATABASE_URL first, matching the TypeScript logic
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        return db_url

    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PWD", "")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "postgres")

    auth = f"{user}:{password}" if password else user
    return f"postgresql://{auth}@{host}:{port}/{name}"

connection_string = get_connection_string()

# Connection pool limit set to 10 to match the previous max: 10
pool = AsyncConnectionPool(conninfo=connection_string, max_size=10, open=False)