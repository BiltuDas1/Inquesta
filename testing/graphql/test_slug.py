from playwright.sync_api import APIRequestContext


def test_get_course_empty_slug(api_request_context: APIRequestContext):

  response = api_request_context.post(
    "/",
    data={
      "query": """
                query GetCourseInfo($slug: String!) {
                  getCourseInfo(slug: $slug) {
                    success
                    message
                    data {
                      description
                      duration
                      icon
                      id
                      instructorName
                      level
                      price
                      slug
                      title
                    }
                  }
                }
            """,
      "variables": {"slug": ""},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  response_json = response.json()

  assert "errors" not in response_json, (
    f"getCourseInfo GraphQL Errors: {response_json.get('errors')}"
  )

  assert "data" in response_json, "getCourseInfo missing 'data' field"
  result = response_json["data"].get("getCourseInfo")

  assert result is not None, (
    f"getCourseInfo result was null. Errors: {response_json.get('errors')}"
  )

  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_get_course_invalid_slug(api_request_context: APIRequestContext):

  response = api_request_context.post(
    "/",
    data={
      "query": """
                query GetCourseInfo($slug: String!) {
                  getCourseInfo(slug: $slug) {
                    success
                    message
                    data {
                      description
                      duration
                      icon
                      id
                      instructorName
                      level
                      price
                      slug
                      title
                    }
                  }
                }
            """,
      "variables": {"slug": "non-existing-course"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  response_json = response.json()

  assert "errors" not in response_json, (
    f"getCourseInfo GraphQL Errors: {response_json.get('errors')}"
  )

  assert "data" in response_json, "getCourseInfo missing 'data' field"
  result = response_json["data"].get("getCourseInfo")

  assert result is not None, (
    f"getCourseInfo result was null. Errors: {response_json.get('errors')}"
  )

  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_get_course_special_char_slug(api_request_context: APIRequestContext):

  response = api_request_context.post(
    "/",
    data={
      "query": """
                query GetCourseInfo($slug: String!) {
                  getCourseInfo(slug: $slug) {
                    success
                    message
                    data {
                      description
                      duration
                      icon
                      id
                      instructorName
                      level
                      price
                      slug
                      title
                    }
                  }
                }
            """,
      "variables": {"slug": "spring@boot!!"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  response_json = response.json()

  assert "errors" not in response_json, (
    f"getCourseInfo GraphQL Errors: {response_json.get('errors')}"
  )

  assert "data" in response_json, "getCourseInfo missing 'data' field"
  result = response_json["data"].get("getCourseInfo")

  assert result is not None, (
    f"getCourseInfo result was null. Errors: {response_json.get('errors')}"
  )

  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_get_course_very_long_slug(api_request_context: APIRequestContext):

  response = api_request_context.post(
    "/",
    data={
      "query": """
                query GetCourseInfo($slug: String!) {
                  getCourseInfo(slug: $slug) {
                    success
                    message
                    data {
                      description
                      duration
                      icon
                      id
                      instructorName
                      level
                      price
                      slug
                      title
                    }
                  }
                }
            """,
      "variables": {
        "slug": "learn-spring-boot-and-microservices-from-scratch-with-hands-on-projects-2026"
      },
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  response_json = response.json()

  assert "errors" not in response_json, (
    f"getCourseInfo GraphQL Errors: {response_json.get('errors')}"
  )

  assert "data" in response_json, "getCourseInfo missing 'data' field"
  result = response_json["data"].get("getCourseInfo")

  assert result is not None, (
    f"getCourseInfo result was null. Errors: {response_json.get('errors')}"
  )

  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"


def test_get_course_numeric_slug_not_found(api_request_context: APIRequestContext):

  response = api_request_context.post(
    "/",
    data={
      "query": """
                query GetCourseInfo($slug: String!) {
                  getCourseInfo(slug: $slug) {
                    success
                    message
                    data {
                      description
                      duration
                      icon
                      id
                      instructorName
                      level
                      price
                      slug
                      title
                    }
                  }
                }
            """,
      "variables": {"slug": "12345"},
    },
  )

  assert response.ok, f"API failed with status {response.status}"
  response_json = response.json()

  assert "errors" not in response_json, (
    f"getCourseInfo GraphQL Errors: {response_json['errors']}"
  )

  assert "data" in response_json, "getCourseInfo missing 'data' field"
  result = response_json["data"].get("getCourseInfo")

  assert result is not None, (
    f"getCourseInfo result was null. Errors: {response_json.get('errors')}"
  )

  assert result.get("success") is False, f"Expected False, got {result.get('success')}"
  assert isinstance(result.get("message"), str), (
    f"Expected str message, got {type(result.get('message'))}"
  )
  assert result.get("data") is None, f"Expected null, got {result.get('data')}"
