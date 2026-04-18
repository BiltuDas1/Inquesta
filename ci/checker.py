from markdown_it import MarkdownIt
import dotenv
from pathlib import Path
import sys

md = MarkdownIt("gfm-like")

with open(Path("..") / "docs" / "environment.md", "r") as f:
  tokens = md.parse(f.read())

tables = []
current_table = []
current_row = []
is_in_table = False

for token in tokens:
  if token.type == "table_open":
    is_in_table = True
    current_table = []

  elif token.type == "table_close":
    is_in_table = False
    tables.append(current_table)
      
  # Detect row boundaries
  elif token.type == "tr_open":
    current_row = []
  elif token.type == "tr_close":
    current_table.append(current_row)
      
  elif token.type == "inline" and is_in_table:
    # Clean up the content (removing backticks if they exist)
    clean_content = token.content.replace("`", "").strip()
    current_row.append(clean_content)

if tables:
  important_vars = [row[0] for row in tables[0][1:] if ":white_check_mark:" in row]
  config = dotenv.dotenv_values(".env")

  success = True
  for var in important_vars:
    if var not in config:
      success = False
      print(f"Environment Variable `{var}` not found")

  if not success:
    print("Please redeploy from dashboard to refresh environment variables")
    sys.exit(78)
