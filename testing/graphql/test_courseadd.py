from playwright.sync_api import APIRequestContext
from helpers.auth_token import get_access_token


def test_course_add_by_student(api_request_context: APIRequestContext):

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
        "email": "rohan123@gmail.com",
        "firstname": "rohan",
        "is_student": True,
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
        "email": "rohan123@gmail.com",
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
  assert login_result["data"]["email"] == "rohan123@gmail.com"
  assert login_result["data"]["firstname"] == "rohan"
  assert login_result["data"]["lastname"] == "manna"
  assert login_result["data"]["role"] == "student"

  access_token = get_access_token(login_response)
  assert access_token is not None, "Access token not found in cookies"

  course_response = api_request_context.post(
    "/",
    headers={"Cookie": f"access_token={access_token}"},
    data={
      "query": """
                mutation CourseAdd(
                  $title: String!
                  $price: Int!
                  $level: String!
                  $duration: String!
                  $instructor_name: String!
                  $description: String
                  $icon_name: String
                ) {
                  courseAdd(
                    title: $title
                    price: $price
                    level: $level
                    duration: $duration
                    instructor_name: $instructor_name
                    description: $description
                    icon_name: $icon_name
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "title": "Java Full Stack",
        "price": 1000,
        "level": "Beginner",
        "duration": "3 Months",
        "instructor_name": "Aman",
        "description": "",
        "icon_name": "",
      },
    },
  )

  assert course_response.ok, f"API failed with status {course_response.status}"
  res_json = course_response.json()

  assert "errors" not in res_json, f"Courseadd GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("courseAdd")

  assert result is not None, (
    f"courseAdd result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )


def test_course_add_by_parent(api_request_context: APIRequestContext):

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
        "email": "rohan12345@gmail.com",
        "firstname": "rohan",
        "is_student": False,
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
        "email": "rohan12345@gmail.com",
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
  assert login_result["data"]["email"] == "rohan12345@gmail.com"
  assert login_result["data"]["firstname"] == "rohan"
  assert login_result["data"]["lastname"] == "manna"
  assert login_result["data"]["role"] == "parent"

  access_token = get_access_token(login_response)
  assert access_token is not None, "Access token not found in cookies"

  course_response = api_request_context.post(
    "/",
    headers={"Cookie": f"access_token={access_token}"},
    data={
      "query": """
                mutation CourseAdd(
                  $title: String!
                  $price: Int!
                  $level: String!
                  $duration: String!
                  $instructor_name: String!
                  $description: String
                  $icon_name: String
                ) {
                  courseAdd(
                    title: $title
                    price: $price
                    level: $level
                    duration: $duration
                    instructor_name: $instructor_name
                    description: $description
                    icon_name: $icon_name
                  ) {
                    success
                    message
                  }
                }
            """,
      "variables": {
        "title": "Python Full Stack",
        "price": 900,
        "level": "Beginner",
        "duration": "2 Months",
        "instructor_name": "Aman",
        "description": "",
        "icon_name": "",
      },
    },
  )

  assert course_response.ok, f"API failed with status {course_response.status}"
  res_json = course_response.json()

  assert "errors" not in res_json, f"Courseadd GraphQL Errors: {res_json['errors']}"

  assert "data" in res_json, "Response missing 'data' field"
  result = res_json["data"].get("courseAdd")

  assert result is not None, (
    f"courseAdd result was null. Errors: {res_json.get('errors')}"
  )
  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
