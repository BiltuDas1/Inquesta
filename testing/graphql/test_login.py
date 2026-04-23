def test_user_login(api_request_context):
  response = api_request_context.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                accessToken
              
              }
            }
            """,
      "variables": {"email": "test@example.com", "password": "Password@123"},
    },
  )

  assert response.status == 200
