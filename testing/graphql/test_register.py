from playwright.sync_api import APIRequestContext


def test_register_true(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "sameer@123gmail.com",
        "firstname": "sameer",
        "is_student": True,
        "lastname": "gupta",
        "password": "Pass123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is True, f"Expected True, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_false(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "sameer@12345gmail.com",
        "firstname": "sameer",
        "is_student": False,
        "lastname": "gupta",
        "password": "Pass123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is True, f"Expected True, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_email_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "",
        "firstname": "sameer",
        "is_student": True,
        "lastname": "Ali",
        "password": "Password@123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_invalid_email(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "abc@",
        "firstname": "Ram",
        "is_student": True,
        "lastname": "Maity",
        "password": "Password@123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_password_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "user1@test.com",
        "firstname": "Rohit",
        "is_student": True,
        "lastname": "Sharma",
        "password": "",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_firstname_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "user4@test.com",
        "firstname": "",
        "is_student": True,
        "lastname": "Sharma",
        "password": "pass@123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_lastname_empty(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "dipu123@gmail.com",
        "firstname": "Dipankar",
        "is_student": False,
        "password": "pass@123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is True, f"Expected True, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_password_too_short(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "user2@test.com",
        "firstname": "Rohit",
        "is_student": False,
        "lastname": "Sharma",
        "password": "123",
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_password_too_long(api_request_context: APIRequestContext):
  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": {
        "email": "user3@test.com",
        "firstname": "Sachin",
        "is_student": False,
        "lastname": "Tendulkar",
        "password": "A" * 100,
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is True, f"Expected True, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_register_duplicate_email(api_request_context: APIRequestContext):
  payload = {
    "email": "duplicate@test.com",
    "firstname": "Rahul",
    "is_student": False,
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
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": payload,
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is True, f"Expected True, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )

  response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $is_student: Boolean!
                  $lastname: String
                  $password: String!
                ) {
                  register(
                    email: $email
                    firstname: $firstname
                    is_student: $is_student
                    lastname: $lastname
                    password: $password
                  ) {
                    message
                    success
                  }
                }
            """,
      "variables": payload,
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  res_json = response.json()

  assert "errors" not in res_json, f"Register GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("register")

  assert result is not None, (
    f"Register result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
