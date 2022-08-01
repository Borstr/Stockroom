import merge from "lodash.merge";
import fs from 'fs';
import { gql } from 'apollo-server-express';

import productResolvers from "./resolvers/productResolvers";
import taskResolvers from './resolvers/taskResolvers';

const productTypeDefs = gql(fs.readFileSync(__dirname.concat('/typeDefs/productTypeDefs.gql'), 'utf8'))
const taskTypeDefs = gql(fs.readFileSync(__dirname.concat('/typeDefs/taskTypeDefs.gql'), 'utf8'))

const schema = {
    typeDefs: [
        productTypeDefs,
        taskTypeDefs
    ],
    resolvers: merge(
        {},
        productResolvers,
        taskResolvers 
    )
}

export default schema;