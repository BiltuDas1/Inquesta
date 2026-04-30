from playwright.sync_api import APIRequestContext


def test_login_email_not_exist(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success
                message
                data {
                  email
                  role
                }
              }
            }
            """,
      "variables": {"email": "indranil@gmail.com", "password": "Totan@12042001"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("login")

  assert result is not None, f"Login result was null. Errors: {res_json.get('errors')}"
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str success message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_login_password_incorrect(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success
                message
                data {
                  email
                  role
                }
              }
            }
            """,
      "variables": {"email": "indranil27cse@gmail.com", "password": "Totan@2001"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("login")

  assert result is not None, f"Login result was null. Errors: {res_json.get('errors')}"
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str success message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_login_user_inactive(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success
                message
                data {
                  email
                  role
                }
              }
            }
            """,
      "variables": {"email": "indranil27cse@gmail.com", "password": "Totan@12042001"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("login")

  assert result is not None, f"Login result was null. Errors: {res_json.get('errors')}"
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str success message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_login_email_case_mismatch(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success
                message
                data {
                  email
                  role
                }
              }
            }
            """,
      "variables": {"email": "indranil27cse@gmail.org", "password": "Totan@12042001"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("login")

  assert result is not None, f"Login result was null. Errors: {res_json.get('errors')}"
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str success message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_login_password_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success
                message
                data {
                  email
                  role
                }
              }
            }
            """,
      "variables": {"email": "indranil27cse@gmail.com", "password": ""},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("login")

  assert result is not None, f"Login result was null. Errors: {res_json.get('errors')}"
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str success message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"
