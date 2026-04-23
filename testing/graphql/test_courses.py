from helpers.auth import register_user, login


def test_create_course(api_request_context):
  register_user(api_request_context)
  token = login(api_request_context)

  response = api_request_context.post(
    "/",
    headers={"Authorization": f"Bearer {token}"},
    data={
      "query": """
            mutation CreateCourse($input: CreateCourseInput!) {
              createCourse(input: $input) {
                id
                title
              }
            }
            """,
      "variables": {
        "input": {"title": "GraphQL Course", "price": 999, "duration": "10h"}
      },
    },
  )

  assert response.status == 200
  body = response.json()
  assert "errors" not in body
