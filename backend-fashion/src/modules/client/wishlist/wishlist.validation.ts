import {z}  from "zod";

export const addWishListSchema = z.object({
    productId: z.number().int().positive(),   
})

export const productParamSchema = z.object({
    productId: z.coerce.number({message: "productId khong hop le"}).int("productId phai la so nguyen").positive("productId phai la so duong"),
})

export type AddWishListInput = z.infer<typeof addWishListSchema>