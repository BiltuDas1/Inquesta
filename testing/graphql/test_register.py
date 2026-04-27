from playwright.sync_api import APIRequestContext


def test_register_email_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "",
          "password": "Password@123",
          "firstName": "sameer",
          "lastName": "Ali",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_invalid_email(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "abc@",
          "password": "Password@123",
          "firstName": "Ram",
          "lastName": "Maity",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_password_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "user1@test.com",
          "password": "",
          "firstName": "Rohit",
          "lastName": "Sharma",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_password_too_short(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "user2@test.com",
          "password": "123",
          "firstName": "Test",
          "lastName": "User",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_password_too_long(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "user3@test.com",
          "password": "A" * 100,
          "firstName": "Test",
          "lastName": "User",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_firstname_missing(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "user2@test.com",
          "password": "Password@123",
          "lastName": "User",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_lastname_missing(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "user3@test.com",
          "password": "Password@123",
          "firstName": "Test",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_extra_field(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {
        "input": {
          "email": "user6@test.com",
          "password": "Password@123",
          "firstName": "Test",
          "lastName": "User",
          "role": "ADMIN",
        }
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_input_null(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput) {
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {"input": None},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_duplicate_email(api_request_context: APIRequestContext):
  payload = {
    "email": "duplicate@test.com",
    "password": "Password@123",
    "firstName": "Test",
    "lastName": "User",
  }

  api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
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
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {"input": payload},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_register_same_email_before_verification(
  api_request_context: APIRequestContext,
):
  payload = {
    "email": "verify@test.com",
    "password": "Password@123",
    "firstName": "Test",
    "lastName": "User",
  }

  api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register($input: RegisterInput!) {
                  register(input: $input) {
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
                  register(input: $input) {
                    success
                    message
                    data {
                      email
                    }
                  }
                }
            """,
      "variables": {"input": payload},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  if "errors" in res_json:
    print(f"GraphQL Errors: {res_json['errors']}")

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"
