//product.service.ts
import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

// input by the user
const productInput = {
    title: z.string(),
    price: z.number(),
    content: z.string().optional(),
};

// properties that are generated for the product
const productGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};


const createProductSchema = z.object({
    ... productInput,
})

// return single product
const productResponseSchema = z.object({
    ...productInput,
    ...productGenerated
})

// return multiple product
const productsResponseSchema = z.array(productResponseSchema)



export type CreateProductInput = z.infer<typeof createProductSchema>;

export const {schemas:productSchemas, $ref} = buildJsonSchemas({
    createProductSchema,
    // createProductResponseSchema, // productResponseSchema ile aynı
    productResponseSchema,
    productsResponseSchema,
},
{
    $id: 'productSchemas', // add schema an unique id
});