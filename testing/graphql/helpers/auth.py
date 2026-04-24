def register_user(api):
  api.post(
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


def login(api):
  response = api.post(
    "/",
    data={
      "query": """
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                accessToken
              }
            }
            """,
      "variables": {"email": "admin@test.com", "password": "Password@123"},
    },
  )

  assert response.status == 200
  body = response.json()

  if "errors" in body:
    raise AssertionError(body["errors"])

  token = body["data"]["login"]["accessToken"]
  assert token, "Access token missing"

  return token
