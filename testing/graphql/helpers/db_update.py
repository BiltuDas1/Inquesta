import mysql.connector


def promote_to_admin(email):
  conn = mysql.connector.connect(
    host="mysql", user="root", password="pass123", database="inquesta"
  )
  cursor = conn.cursor()
  cursor.execute("UPDATE users SET role='admin' WHERE email=%s", (email,))
  conn.commit()
  cursor.close()
  conn.close()
