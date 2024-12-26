import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service"
import { createUserInput, LoginInput } from "./user.schema";
import { verify } from "crypto";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(
    request:FastifyRequest<{
        Body: createUserInput
    }>, 
    reply:FastifyReply
) 
{
    const body = request.body;
    try {
        const user = await createUser(body);
        return reply.code(201).send(user);
    }   
    // if we have a conflict, you're going to want to send back a status 409 
    catch(e){
        console.log(e);
        return reply.code(500).send(e);
    }
}

export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginInput
    }>,
    reply: FastifyReply,
){
    // body contains the email and the password 
    const body= request.body;

    // find a user by email
    const user = await findUserByEmail(body.email);
    if(!user){
        return reply.code(401).send({
            message: "Invalid email or password",
        });
    }

    // verify password
    const coorectPassword = verifyPassword({
        candidatePassword: body.password,
        salt: user.salt,
        hash: user.password,
    })
    if(coorectPassword)
    {
        const {password, salt, ...rest} = user;
        // generate access token
        return {accessToken:server.jwt.sign(rest)}
    }
    // else state
    return reply.code(401).send({
        message: "Invalid email or password",
    }); 
}

export async function getUsersHandler(){
    const users = await findUsers();

    return users;
}