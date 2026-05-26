import { builder } from "../libraries/builder.ts";
import { getFilters } from "../resolvers/filter.ts";
import { FilterObject, type Filter } from "../types/filter.ts";

const getFiltersResponse = builder
  .objectRef<{
    success: boolean,
    message: string,
    data?: Filter
  }>("GetFiltersResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: FilterObject
      })
    })
  })

builder.queryField("getFilters", (t) =>
  t.field({
    type: getFiltersResponse,
    args: {},
    resolve: async (_parent, args, context) => {
      const result = await getFilters();
      if (result) {
        return {
          success: true,
          message: "filters data has been fetched successfully",
          data: result
        }
      } else {
        return {
          success: false,
          message: "failed to fetch filters fields"
        }
      }
    }
  })
)
