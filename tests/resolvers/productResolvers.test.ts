const mockingoose = require('mockingoose');
const productResolvers = require('../../src/graphql/resolvers/productResolvers');
const ProductModel = require('../../src/models/Product.model');

describe('Testing Product resolvers.', () => {
    it('should return one product', async () => {
        const test = mockingoose(ProductModel).toReturn([{
            title: 'Pen',
            model: 'Lio',
            color: 'Red',
            inStock: 1,
            inDeliver: 2,
            width: 3,
            length: 4,
            imagePath: 'test'
        }], 'findById');
        console.log(test);

        const product = await productResolvers.Query.getProduct('', { id: test.id }, '', '');
        expect(product.title).toEqual('Pen');
    });
})