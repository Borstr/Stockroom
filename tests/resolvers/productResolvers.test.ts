// CommonJS import instead of ES6 in order to mockingoose to work. 
const mockingoose = require('mockingoose');

import { UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';

import productResolvers from '../../src/graphql/resolvers/productResolvers';
import ProductModel from '../../src/models/Product.model';
import { Product } from '../../src/types';

const mockData: Product[] = [
    {
        id: new mongoose.Types.ObjectId('62e11d5bc9a34411570b4a4b'),
        title: 'Pen',
        model: 'Lio',
        color: 'Red',
        inStock: 1,
        inDelivery: 2,
        width: 3,
        length: 4,
        imagePath: 'test'
    },
    {
        id: new mongoose.Types.ObjectId('62e11d5bc9a34411570b4a4c'),
        title: 'Pen',
        model: 'Lio white',
        color: 'Blue',
        inStock: 1,
        inDelivery: 2,
        width: 3,
        length: 4,
        imagePath: 'test'
    }
];

describe('getProduct resolver', () => {
    it('should return one product', async () => {
        mockingoose(ProductModel).toReturn(mockData[0], 'findOne');

        const product = await productResolvers.Query.getProduct({}, { id: '62e11d5bc9a34411570b4a4b' }, {}, {});
        expect(JSON.stringify(mockData[0]) === JSON.stringify(product));
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('model');
        expect(product).toHaveProperty('color');
        expect(product).toHaveProperty('inStock');
        expect(product).toHaveProperty('inDelivery');
        expect(product).toHaveProperty('width');
        expect(product).toHaveProperty('length');
        expect(product).toHaveProperty('imagePath');
    });

    it('throws an error when id is missing', async () => {
        mockingoose(ProductModel).toReturn(mockData[0], 'findOne');

        try {
            await productResolvers.Query.getProduct({}, { id: '' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing product ID.'));
        }
    });

    it('throws an error when id is incorrect', async () => {
        mockingoose(ProductModel).toReturn(mockData[0], 'findOne');

        try {
            await productResolvers.Query.getProduct({}, { id: 'abc' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect id.'));
        }
    });

    it('throws an error if there is no user with a given id', async () => {
        mockingoose(ProductModel).toReturn(mockData[0], 'findOne');

        try {
            await productResolvers.Query.getProduct({}, { id: '62e11d5bc9a34411570b4a4b' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No user with a given id.'));
        }
    });
});

describe('getAllProducts resolver', () => {
    it('should return 2 products', async () => {
        mockingoose(ProductModel).toReturn(mockData, 'find');

        const products: Product[] | null = await productResolvers.Query.getAllProducts();

        
        expect(JSON.stringify(mockData) === JSON.stringify(products));

        for(let product of products) {
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('title');
            expect(product).toHaveProperty('model');
            expect(product).toHaveProperty('color');
            expect(product).toHaveProperty('inStock');
            expect(product).toHaveProperty('inDelivery');
            expect(product).toHaveProperty('width');
            expect(product).toHaveProperty('length');
            expect(product).toHaveProperty('imagePath');
        }
    });
});