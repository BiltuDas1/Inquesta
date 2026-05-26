from playwright.sync_api import APIRequestContext
from helpers.auth_token import get_access_token
from helpers.auth import register, RegisterData, login
from helpers.db_update import promote_to_admin


def test_course_add_by_student(api_request_context: APIRequestContext):
  register(
    api_request_context,
    RegisterData(
      email="rohan123@gmail.com",
      firstname="rohan",
      lastname="manna",
      password="Pass@123",
      is_student=True,
    ),
  )

  login_response, login_result = login(
    api_request_context, email="rohan123@gmail.com", password="Pass@123"
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
  register(
    api_request_context,
    RegisterData(
      email="rohan12345@gmail.com",
      firstname="rohan",
      lastname="manna",
      password="Pass@123",
      is_student=False,
    ),
  )

  login_response, login_result = login(
    api_request_context, email="rohan12345@gmail.com", password="Pass@123"
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


def test_course_add_by_admin(api_request_context: APIRequestContext):
  register(
    api_request_context,
    RegisterData(
      email="rohanmahato@gmail.com",
      firstname="rohan",
      lastname="mahato",
      password="Pass@123",
      is_student=False,
    ),
  )

  promote_to_admin("rohanmahato@gmail.com")

  login_response, login_result = login(
    api_request_context, email="rohanmahato@gmail.com", password="Pass@123"
  )

  assert login_result["data"]["email"] == "rohanmahato@gmail.com"
  assert login_result["data"]["firstname"] == "rohan"
  assert login_result["data"]["lastname"] == "mahato"
  assert login_result["data"]["role"] == "admin"

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
  assert result.get("success") is True, f"Expected True, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
