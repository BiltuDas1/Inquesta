import pytest
from playwright.sync_api import sync_playwright, APIRequestContext
from typing import Generator

@pytest.fixture(scope="session")
def api_request_context() -> Generator[APIRequestContext, None, None]:
  with sync_playwright() as p:
    headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
    
    request_context = p.request.new_context(
      base_url="http://host.docker.internal:4000",
      extra_http_headers=headers
    )
    
    yield request_context
    request_context.dispose()
