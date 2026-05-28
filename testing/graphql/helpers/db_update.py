import mysql.connector
import os
from urllib.parse import urlparse


def promote_to_admin(email: str):
  MYSQL_URI = os.getenv("MYSQL_URI", "mysql://root:password@mysql:3306/inquesta")
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
  cursor.execute("UPDATE users SET role='admin' WHERE email=%s", (email,))
  conn.commit()
  cursor.close()
  conn.close()
