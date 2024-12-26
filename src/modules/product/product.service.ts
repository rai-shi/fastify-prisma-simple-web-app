import { CreateProductInput } from "./product.schema";
import prisma from "../../utils/prisma";

// create product service

export async function createProduct(
    data:CreateProductInput & {ownerId: number}
){
    
    return prisma.product.create({
        data,
    });
}

// getting a product
export async function getProducts(){
    return prisma.product.findMany({
        select:{
            content:true,
            title: true,
            price: true,
            id:true,
            createdAt:true,
            updatedAt:true,
            owner:{
                select:{
                    name:true,
                    id:true,
                },
            },
        },
    });
}


