const { gql } = require('apollo-server-express');

const productTypeDefs = gql`
    type Product {
        id: ID
        title: String
        model: String
        color: String
        inStock: Int
        inDelivery: Int
        width: Int
        length: Int
        height: Int
        imagePath: String
    }

    enum Order {
        ASC
        DESC
        EQ
    }

    input FilterBy {
        field: String!
        order: Order!
        value: String!
    }

    input SortBy {
        field: String!
        order: Order!
    }

    type Query {
        getProduct(id: ID!): Product
        getAllProducts: [Product]
        getFilteredProducts(filterBy: [FilterBy]!, sortBy: [SortBy]): [Product]
        getSortedProducts(sortBy: [SortBy]!, filterBy: [FilterBy]): [Product]
    }

    input ProductInput {
        title: String!
        color: String!
        model: String
        inStock: Int
        inDelivery: Int
        width: Int
        length: Int
        height: Int
        imagePath: String
    }

    input ProductUpdateInput {
        id: ID!
        title: String
        color: String
        model: String
        inStock: Int
        inDelivery: Int
        width: Int
        length: Int
        height: Int
        imagePath: String
    }

    type Mutation {
        createProduct(product: ProductInput!): Product
        updateProduct(product: ProductUpdateInput!): Product
        deleteProduct(id: ID!): Product
    }
`;

export default productTypeDefs;