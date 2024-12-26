import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import JWT from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import fastifySwaggerUi from "@fastify/swagger-ui";
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import {version} from '../package.json';

export const server = Fastify();


declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}
declare module "@fastify/jwt" {
    export interface FastifyJWT {
        user: {
            id: number;
            email: string;
            name: string;
        };
    }
}

const swaggerOptions = {
    swagger: {
        info: {
            title: "Fastify-Prisma-App-API",
            description: "API for user and products module",
            version,
        },
        host: "localhost",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Default", description: "Default" }],
    },
};

const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
    staticCSP: true,
};

server.register(JWT, {
    secret: "jhdbkjabcabwzıudazuenzaye2n37rwn7e8n32r928rgzyq",
});

server.decorate("authenticate", 
    async(
        request:FastifyRequest,
        reply: FastifyReply) => 
            {
                try{
                    await request.jwtVerify();
                }
                catch (e) {
                    return reply.send(e);
                }
            });

server.get('/healthcheck', async function (request, response) {
    return {status: "OK"};    
})

async function main() {

    // adding schemas
    for(const schema of [...userSchemas, ...productSchemas]) {
        console.log(`Adding schema with ID: ${schema.$id}`);
        server.addSchema(schema);
    }

    server.register(fastifySwagger, swaggerOptions);
    server.register(fastifySwaggerUi, swaggerUiOptions);
    server.register(userRoutes, {prefix: 'api/users'})
    server.register(productRoutes, {prefix: 'api/products'})

    try {
        await server.listen({ port: 3000, host: '0.0.0.0' }); // 0.0.0.0
        console.log(`Server ready at http://localhost:3000`);

    } catch (e) {
        console.log(e);
        process.exit(1);
    }    
}

main();