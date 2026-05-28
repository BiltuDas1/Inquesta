from playwright.sync_api import APIResponse
import re


def get_access_token(response: APIResponse):
  if token := response.headers.get("set-cookie"):
    if match := re.search(r"access_token=([\w.]+)", token):
      access_token = match.group(1)
      if isinstance(access_token, str):
        return access_token
