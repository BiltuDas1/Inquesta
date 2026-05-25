from playwright.sync_api import APIRequestContext
from helpers.auth_token import get_access_token
from helpers.db_update import promote_to_admin


def register_and_login_admin(api_request_context: APIRequestContext):

  register_response = api_request_context.post(
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
                    success
                    message
                  }
                }
            """,
      "variables": {
        "email": "rohanmahato@gmail.com",
        "firstname": "rohan",
        "is_student": False,
        "lastname": "mahato",
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

  promote_to_admin("rohanmahato@gmail.com")

  login_response = api_request_context.post(
    "/",
    data={
      "query": """
                mutation Login($email: String!, $password: String!) {
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
        "email": "rohanmahato@gmail.com",
        "password": "Pass@123",
      },
    },
  )

  assert login_response.ok, f"Login API failed with status {login_response.status}"
  login_json = login_response.json()

  assert "errors" not in login_json, f"Login GraphQL Errors: {login_json['errors']}"

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
    f"Expected data, got {login_result.get('data')}"
  )
  assert login_result["data"]["email"] == "rohanmahato@gmail.com"
  assert login_result["data"]["firstname"] == "rohan"
  assert login_result["data"]["lastname"] == "mahato"
  assert login_result["data"]["role"] == "admin"

  access_token = get_access_token(login_response)
  assert access_token is not None, "Access token not found in cookies"

  return access_token
