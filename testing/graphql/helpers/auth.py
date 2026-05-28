from playwright.sync_api import APIRequestContext
from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class RegisterData:
  email: str
  firstname: str
  password: str
  is_student: bool
  lastname: Optional[str] = None


def asdict_filtered(obj):
  """Converts dataclass to dict, removing fields that are None."""
  return asdict(obj, dict_factory=lambda x: {k: v for (k, v) in x if v is not None})


def register(api_request_context: APIRequestContext, data: RegisterData):
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
      "variables": asdict_filtered(data),
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

  return True


def login(api_request_context: APIRequestContext, email: str, password: str):
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
        "email": email,
        "password": password,
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

  return (login_response, login_result)
