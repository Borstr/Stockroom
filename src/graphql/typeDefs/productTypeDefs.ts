const { gql } = require('apollo-server-express');

const productTypeDefs = gql`
    type Product {
        id: ID
        title: String
        color: String
        inStock: Int
        inDelivery: Int
        size: String
        imagePath: String
    }

    type Query {
        getProduct(id: ID!): Product
        getAllProducts: [Product]
    }

    input ProductInput {
        title: String!
        color: String!
        inStock: Int!
        inDelivery: Int!
        size: String
        imagePath: String
    }

    input ProductUpdateInput {
        id: ID!
        title: String
        color: String
        inStock: Int
        inDelivery: Int
        size: String
        imagePath: String
    }

    type Mutation {
        createProduct(product: ProductInput!): Product
        updateProduct(product: ProductUpdateInput!): Product
        deleteProduct(id: ID!): Product
    }
`;

export default productTypeDefs;