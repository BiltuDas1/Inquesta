from playwright.sync_api import APIRequestContext


def test_register_email_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "email": "",
        "firstname": "sameer",
        "lastname": "Ali",
        "password": "Password@123",
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
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "email": "abc@",
        "firstname": "Ram",
        "lastname": "Maity",
        "password": "Password@123",
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
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "email": "user1@test.com",
        "firstname": "Rohit",
        "lastname": "Sharma",
        "password": "",
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
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "email": "user2@test.com",
        "firstname": "Rohit",
        "lastname": "Sharma",
        "password": "123",
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
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "email": "user3@test.com",
        "firstname": "Sachin",
        "lastname": "Tendulkar",
        "password": "A" * 100,
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


def test_register_duplicate_email(api_request_context: APIRequestContext):
  payload = {
    "email": "duplicate@test.com",
    "firstname": "Rahul",
    "lastname": "Das",
    "password": "Password@123",
  }

  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": payload,
    },
  )

  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    lastname: $lastname
                    password: $password
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": payload,
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
