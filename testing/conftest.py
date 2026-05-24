import pytest
from playwright.sync_api import sync_playwright, APIRequestContext
from typing import Generator
import os
import mysql.connector
import dotenv
from urllib.parse import urlparse
import redis


@pytest.fixture(scope="session", autouse=True)
def initialize_environment():
  dotenv.load_dotenv()
  yield


@pytest.fixture(scope="session")
def api_request_context() -> Generator[APIRequestContext, None, None]:
  with sync_playwright() as p:
    headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }

    request_context = p.request.new_context(
      base_url="http://host.docker.internal:4000", extra_http_headers=headers
    )

    yield request_context
    request_context.dispose()


@pytest.fixture(autouse=True)
def clear_session():
  """
  This fixture runs automatically before every test
  It wipes the databases
  """
  # Cleaning tables of mysql
  MYSQL_URI = os.getenv("MYSQL_URI", "mysql://root:pass123@mysql:3306/inquesta")
  parsed_uri = urlparse(MYSQL_URI)

  db_config = {
    "user": parsed_uri.username,
    "password": parsed_uri.password,
    "host": parsed_uri.hostname,
    "port": parsed_uri.port or 3306,
    "database": parsed_uri.path.lstrip("/"),
  }

  conn = mysql.connector.connect(**db_config)
  cursor = conn.cursor()
  cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

  cursor.execute("SHOW TABLES;")
  tables = cursor.fetchall()

  for table in tables:
    table_name = table[0]  # type: ignore

    if table_name != "__drizzle_migrations":
      cursor.execute(f"TRUNCATE TABLE `{table_name}`;")

  cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
  conn.commit()

  cursor.close()
  conn.close()

  # Cleaning redis database
  REDIS_URI = os.getenv("REDIS_URI", "redis://redis:6379")
  client = redis.from_url(REDIS_URI, decode_responses=True)
  client.flushall()
  client.close()

  yield
