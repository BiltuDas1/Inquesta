from playwright.sync_api import APIRequestContext


def test_ping(api_request_context: APIRequestContext):
  response = api_request_context.post("/", data={"query": """query { ping }"""})

  assert response.ok
  res_json = response.json()
  assert "errors" not in res_json
  assert res_json["data"]["ping"] == "pong"
