'use strict';
import dotenv from 'dotenv';
import express, { Request, Response} from 'express';
import mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server-express';

import schema from './graphql/schema';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
const DBPassword = process.env.MONGODB_PASSWORD;

async function startServer() {
    const apolloServer = new ApolloServer(schema);

    await apolloServer.start();

    apolloServer.applyMiddleware({app});

    app.get('/', (req:Request, res:Response) => res.send('index'));

    await mongoose.connect(`mongodb+srv://Nadrek:${DBPassword}@cluster0.feu7b.mongodb.net/?retryWrites=true&w=majority`);

    app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
}

startServer();