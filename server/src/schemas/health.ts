import { builder } from "../libraries/builder.ts";

builder.queryField("ping", (t) => {
  return t.string({
    resolve: () => "pong",
  });
});
