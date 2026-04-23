from helpers.auth import register_user


def test_user_register(api_request_context):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Register($input: RegisterInput!) {
              register(input: $input) {
                id
              }
            }
            """,
      "variables": {"input": {"email": "admin@test.com", "password": "Password@123"}},
    },
  )

  assert response.status == 200
