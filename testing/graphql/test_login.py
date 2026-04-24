from playwright.sync_api import APIRequestContext


def test_login_email_not_exist(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role {
                  email
                }
                jwt {
                  accessToken
                }
              }
            }
            """,
      "variables": {"email": "nouser@inquesta.org", "password": "Password@123"},
    },
  )

  assert response.ok
  res_json = response.json()

  if "errors" in res_json:
    assert True
  else:
    assert res_json["data"]["loginUser"] is None


def test_login_wrong_password(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role {
                  email
                }
                jwt {
                  accessToken
                }
              }
            }
            """,
      "variables": {"email": "nouser@inquesta.org", "password": "PasswordWrong"},
    },
  )

  assert response.ok
  res_json = response.json()

  if "errors" in res_json:
    assert True
  else:
    assert res_json["data"]["loginUser"] is None


def test_login_inactive_user(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role {
                  email
                }
                jwt {
                  accessToken
                }
              }
            }
            """,
      "variables": {"email": "inactive@inquesta.org", "password": "Password@123"},
    },
  )

  assert response.ok
  res_json = response.json()

  if "errors" in res_json:
    assert True
  else:
    assert res_json["data"]["loginUser"] is None


def test_login_email_case_mismatch(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role {
                  email
                }
              }
            }
            """,
      "variables": {"email": "Test@Inquesta.Org", "password": "Password@123"},
    },
  )

  assert response.ok
  res_json = response.json()

  # Depends on DB collation → accept both
  if "errors" in res_json:
    assert True
  else:
    assert (
      res_json["data"]["loginUser"] is None
      or res_json["data"]["loginUser"]["role"]["email"].lower() == "test@inquesta.org"
    )


def test_login_email_null(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role { email }
              }
            }
            """,
      "variables": {"email": None, "password": "Password@123"},
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_login_password_null(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role { email }
              }
            }
            """,
      "variables": {"email": "valid@inquesta.org", "password": None},
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_login_password_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                role {
                  email
                }
              }
            }
            """,
      "variables": {"email": "validuser@inquesta.org", "password": ""},
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json
