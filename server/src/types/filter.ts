import { builder } from "../libraries/builder.ts";

export type Filter = {
  levels: string[],
  grades: string[],
  price: Price
}

type Price = {
  minPrice: number,
  maxPrice: number
}

export const FilterObject = builder
  .objectRef<Filter>("Filter")
  .implement({
    fields: (t) => ({
      levels: t.exposeStringList("levels"),
      grades: t.exposeStringList("grades"),
      price: t.expose("price", {
        type: PriceObject
      })
    }),
  });

export const PriceObject = builder
  .objectRef<Price>("Price")
  .implement({
    fields: (t) => ({
      minPrice: t.exposeInt("minPrice"),
      maxPrice: t.exposeInt("maxPrice")
    })
  })