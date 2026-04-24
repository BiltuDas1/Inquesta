def test_graphql_alive(api_request_context):
  response = api_request_context.post("/", data={"query": "{ __typename }"})

  assert response.status == 200
  body = response.json()
  assert "errors" not in body
