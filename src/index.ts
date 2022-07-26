"use strict";
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.get('/', (req, res) => {
    console.log("Apollo GraphQL Express server is ready");
});

app.listen({ port: 8000 }, () => {
    console.log(`Server is running at http://localhost:8080`);
});