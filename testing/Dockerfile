FROM mcr.microsoft.com/playwright/python:v1.58.0-noble

RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

RUN poetry config virtualenvs.in-project true

CMD [ "/bin/bash" ]
