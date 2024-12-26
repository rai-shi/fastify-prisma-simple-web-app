import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma"
import { createUserInput } from "./user.schema"

// since input getting error so we create a type for it 
export async function createUser(input: createUserInput)
{
    // 'password' and 'rest' of the other info that comes from the user registering process
    const {password, ...rest} = input;

    // utils/hash.ts/hashPassword
    const {hash, salt} = hashPassword(password);

    // email name password salt products
    // we give password as a hash
    const user = await prisma.user.create({
        data:{ ...rest, salt, password:hash},
    })
    
    return user
}

export async function findUserByEmail(email:string) {

    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}


export async function findUsers(){
    return prisma.user.findMany({
        select:{
            email:true,
            name:true,
            id:true,
        }
    });
}