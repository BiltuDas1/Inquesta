from playwright.sync_api import APIRequestContext


def test_login_successful(api_request_context: APIRequestContext):

  register_response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String
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
        "email": "rohan123@gmail.com",
        "firstname": "rohan",
        "lastname": "manna",
        "password": "Pass@123",
      },
    },
  )

  assert register_response.ok, (
    f"Register API failed with status {register_response.status}"
  )
  register_json = register_response.json()

  assert "errors" not in register_json, (
    f"Register GraphQL Errors: {register_json['errors']}"
  )

  assert "data" in register_json, "Register response missing 'data' field"
  register_result = register_json["data"].get("register")

  assert register_result is not None, (
    f"Register result was null. Errors: {register_json.get('errors')}"
  )
  assert register_result.get("success") is True, (
    f"Expected True, got {register_result.get('success')}"
  )
  assert isinstance(register_result.get("message"), str), (
    f"Expected str message, got {type(register_result.get('message'))}"
  )

  login_response = api_request_context.post(
    "/",
    data={
      "query": """
                query Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    success
                    message
                    data {
                      email
                      firstname
                      lastname
                      role
                    }
                  }
                }
            """,
      "variables": {
        "email": "rohan123@gmail.com",
        "password": "Pass@123",
      },
    },
  )

  assert login_response.ok, f"Login API failed with status {login_response.status}"
  login_json = login_response.json()

  assert "errors" not in login_json, f"Register GraphQL Errors: {login_json['errors']}"

  assert "data" in login_json, "Login response missing 'data' field"
  login_result = login_json["data"].get("login")

  assert login_result is not None, (
    f"Login result was null. Errors: {login_json.get('errors')}"
  )
  assert login_result.get("success") is True, (
    f"Expected True, got {login_result.get('success')}"
  )
  assert isinstance(login_result.get("message"), str), (
    f"Expected str message, got {type(login_result.get('message'))}"
  )
  assert login_result.get("data") is not None, (
    f"Expected null, got {login_result.get('data')}"
  )
  assert login_result["data"]["email"] == "rohan123@gmail.com"
  assert login_result["data"]["firstname"] == "rohan"
  assert login_result["data"]["lastname"] == "manna"
  assert "role" in login_result["data"]


def test_login_email_not_exist(api_request_context: APIRequestContext):

  login_response = api_request_context.post(
    "/",
    data={
      "query": """
                query Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    success
                    message
                    data {
                      email
                      firstname
                      lastname
                      role
                    }
                  }
                }
            """,
      "variables": {
        "email": "rohan@gmail.com",
        "password": "Pass@123",
      },
    },
  )

  assert login_response.ok, f"Login API failed with status {login_response.status}"
  login_json = login_response.json()

  assert "errors" not in login_json, f"Register GraphQL Errors: {login_json['errors']}"

  assert "data" in login_json, "Login response missing 'data' field"
  login_result = login_json["data"].get("login")

  assert login_result is not None, (
    f"Login result was null. Errors: {login_json.get('errors')}"
  )
  assert login_result.get("success") is False, (
    f"Expected False, got {login_result.get('success')}"
  )
  assert isinstance(login_result.get("message"), str), (
    f"Expected str message, got {type(login_result.get('message'))}"
  )
  assert login_result.get("data") is None, (
    f"Expected null, got {login_result.get('data')}"
  )


def test_login_password_incorrect(api_request_context: APIRequestContext):

  register_response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String
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
        "email": "rohandas@gmail.com",
        "firstname": "rohan",
        "lastname": "das",
        "password": "Pass@123",
      },
    },
  )

  assert register_response.ok, (
    f"Register API failed with status {register_response.status}"
  )
  register_json = register_response.json()

  assert "errors" not in register_json, (
    f"Register GraphQL Errors: {register_json['errors']}"
  )

  assert "data" in register_json, "Register response missing 'data' field"
  register_result = register_json["data"].get("register")

  assert register_result is not None, (
    f"Register result was null. Errors: {register_json.get('errors')}"
  )
  assert register_result.get("success") is True, (
    f"Expected True, got {register_result.get('success')}"
  )
  assert isinstance(register_result.get("message"), str), (
    f"Expected str message, got {type(register_result.get('message'))}"
  )

  login_response = api_request_context.post(
    "/",
    data={
      "query": """
                query Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    success
                    message
                    data {
                      email
                      firstname
                      lastname
                      role
                    }
                  }
                }
            """,
      "variables": {
        "email": "rohandas@gmail.com",
        "password": "Pass@12",
      },
    },
  )

  assert login_response.ok, f"Login API failed with status {login_response.status}"
  login_json = login_response.json()

  assert "errors" not in login_json, f"Register GraphQL Errors: {login_json['errors']}"

  assert "data" in login_json, "Login response missing 'data' field"
  login_result = login_json["data"].get("login")

  assert login_result is not None, (
    f"Login result was null. Errors: {login_json.get('errors')}"
  )
  assert login_result.get("success") is False, (
    f"Expected False, got {login_result.get('success')}"
  )
  assert isinstance(login_result.get("message"), str), (
    f"Expected str message, got {type(login_result.get('message'))}"
  )
  assert login_result.get("data") is None, (
    f"Expected null, got {login_result.get('data')}"
  )


def test_login_email_case_mismatch(api_request_context: APIRequestContext):

  register_response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Register(
                  $email: String!
                  $firstname: String!
                  $lastname: String
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
        "email": "rohannayak@gmail.com",
        "firstname": "rohan",
        "lastname": "nayak",
        "password": "Pass@123",
      },
    },
  )

  assert register_response.ok, (
    f"Register API failed with status {register_response.status}"
  )
  register_json = register_response.json()

  assert "errors" not in register_json, (
    f"Register GraphQL Errors: {register_json['errors']}"
  )

  assert "data" in register_json, "Register response missing 'data' field"
  register_result = register_json["data"].get("register")

  assert register_result is not None, (
    f"Register result was null. Errors: {register_json.get('errors')}"
  )
  assert register_result.get("success") is True, (
    f"Expected True, got {register_result.get('success')}"
  )
  assert isinstance(register_result.get("message"), str), (
    f"Expected str message, got {type(register_result.get('message'))}"
  )

  login_response = api_request_context.post(
    "/",
    data={
      "query": """
                query Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    success
                    message
                    data {
                      email
                      firstname
                      lastname
                      role
                    }
                  }
                }
            """,
      "variables": {
        "email": "rohannayak@gmail.org",
        "password": "Pass@123",
      },
    },
  )

  assert login_response.ok, f"Login API failed with status {login_response.status}"
  login_json = login_response.json()

  assert "errors" not in login_json, f"Register GraphQL Errors: {login_json['errors']}"

  assert "data" in login_json, "Login response missing 'data' field"
  login_result = login_json["data"].get("login")

  assert login_result is not None, (
    f"Login result was null. Errors: {login_json.get('errors')}"
  )
  assert login_result.get("success") is False, (
    f"Expected False, got {login_result.get('success')}"
  )
  assert isinstance(login_result.get("message"), str), (
    f"Expected str message, got {type(login_result.get('message'))}"
  )
  assert login_result.get("data") is None, (
    f"Expected null, got {login_result.get('data')}"
  )


def test_login_email_empty(api_request_context: APIRequestContext):

  login_response = api_request_context.post(
    "/",
    data={
      "query": """
                query Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    success
                    message
                    data {
                      email
                      firstname
                      lastname
                      role
                    }
                  }
                }
            """,
      "variables": {
        "email": "",
        "password": "Pass@123",
      },
    },
  )

  assert login_response.ok, f"Login API failed with status {login_response.status}"
  login_json = login_response.json()

  assert "errors" not in login_json, f"Register GraphQL Errors: {login_json['errors']}"

  assert "data" in login_json, "Login response missing 'data' field"
  login_result = login_json["data"].get("login")

  assert login_result is not None, (
    f"Login result was null. Errors: {login_json.get('errors')}"
  )
  assert login_result.get("success") is False, (
    f"Expected False, got {login_result.get('success')}"
  )
  assert isinstance(login_result.get("message"), str), (
    f"Expected str message, got {type(login_result.get('message'))}"
  )
  assert login_result.get("data") is None, (
    f"Expected null, got {login_result.get('data')}"
  )
