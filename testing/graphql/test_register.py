from playwright.sync_api import APIRequestContext


def test_register_email_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Rohit",
          "lastname": "Sharma",
          "email": "",
          "password": "Password@123",
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json or res_json["data"]["registerUser"]["success"] is False


def test_register_invalid_email(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Sachin",
          "lastname": "Tendulkar",
          "email": "abc@",
          "password": "Password@123",
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json or res_json["data"]["registerUser"]["success"] is False


def test_register_password_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Virat",
          "lastname": "Kohali",
          "email": "test1@inquesta.org",
          "password": "",
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json or res_json["data"]["registerUser"]["success"] is False


def test_register_password_too_short(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Test",
          "lastname": "User",
          "email": "shortpass@inquesta.org",
          "password": "12345",
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_password_too_long(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Ram",
          "lastname": "Gupta",
          "email": "longpass@inquesta.org",
          "password": "a" * 300,
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_firstname_missing(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {
        "input": {
          "lastname": "Due",
          "email": "test2@inquesta.org",
          "password": "Password@123",
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_lastname_missing(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Jone",
          "email": "test2@inquesta.org",
          "password": "Password@123",
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_extra_fields(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
              }
            }
            """,
      "variables": {
        "input": {
          "firstname": "Tushar",
          "lastname": "Das",
          "email": "extrafield@inquesta.org",
          "password": "Password@123",
          "isAdmin": True,
        }
      },
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_data_null(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
              }
            }
            """,
      "variables": {"input": None},
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_email_already_exists(api_request_context: APIRequestContext):
  payload = {
    "firstname": "Test",
    "lastname": "User",
    "email": "duplicate@inquesta.org",
    "password": "Password@123",
  }

  # First registration
  api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
              }
            }
            """,
      "variables": {"input": payload},
    },
  )

  # Second registration (duplicate)
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
                message
              }
            }
            """,
      "variables": {"input": payload},
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json


def test_register_same_email_before_verification(
  api_request_context: APIRequestContext,
):
  payload = {
    "firstname": "Test",
    "lastname": "User",
    "email": "noverify@inquesta.org",
    "password": "Password@123",
  }

  api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
              }
            }
            """,
      "variables": {"input": payload},
    },
  )

  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                success
              }
            }
            """,
      "variables": {"input": payload},
    },
  )

  assert response.ok
  res_json = response.json()
  assert "errors" in res_json
