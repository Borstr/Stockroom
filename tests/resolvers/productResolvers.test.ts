import { UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import dotenv from 'dotenv';

import productResolvers from '../../src/graphql/resolvers/productResolvers';
import ProductModel from '../../src/models/Product.model';
import { Product } from '../../src/types';

const mockgoose = new Mockgoose(mongoose);

dotenv.config();
const DBPassword = process.env.MONGODB_PASSWORD;

const mockData: Product[] = [
    {
        id: '',
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
        id: '',
        title: 'Pen',
        model: 'Lio white',
        color: 'Blue',
        inStock: 1,
        inDelivery: 2,
        width: 3,
        length: 4,
        imagePath: 'test'
    },
    {
        id: '',
        title: 'Bag',
        model: 'Lio white',
        color: 'Blue',
        inStock: 1,
        inDelivery: 2,
        width: 3,
        length: 4,
        imagePath: 'test'
    },
    {
        id: '',
        title: 'Lighter',
        model: 'Lio white',
        color: 'Blue',
        inStock: 1,
        inDelivery: 2,
        width: 3,
        length: 4,
        imagePath: 'test'
    }
];

beforeAll((done) => {
    mockgoose.prepareStorage().then(async () => await mongoose.connect(`mongodb+srv://Nadrek:${DBPassword}@cluster0.feu7b.mongodb.net/?retryWrites=true&w=majority`));
    mongoose.connection.on('connected', async () => {
        await ProductModel.create(mockData);
        done();
    });
});

afterAll((done) => {
    mockgoose.helper.reset();
    mockgoose.shutdown();
    done()
});

describe('getProduct resolver', () => {
    it('should return one product', async () => {
        const products: Product[] = await ProductModel.find({});
        const product: Product | null = await productResolvers.Query.getProduct({}, { id: products[0].id ? products[0].id : '' }, {}, {});
        
        expect(JSON.stringify(products[0]) === JSON.stringify(product));
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
        try {
            await productResolvers.Query.getProduct({}, { id: '' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing product ID.'));
        }
    });

    it('throws an error when id is incorrect', async () => {
        try {
            await productResolvers.Query.getProduct({}, { id: 'abc' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect id.'));
        }
    });

    it('throws an error if there is no user with a given id', async () => {
        try {
            await productResolvers.Query.getProduct({}, { id: '62e11d5bc9a34411570b4a4b' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No user with a given id.'));
        }
    });
});

describe('getAllProducts resolver', () => {
    it('should return 2 products', async () => {
        const baseProducts: Product[] | null = await ProductModel.find({});
        const products: Product[] | null = await productResolvers.Query.getAllProducts();

        
        expect(JSON.stringify(baseProducts) === JSON.stringify(products));

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

describe('getFilteredProducts resolver', () => {
    it('shows products equal to filter setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getFilteredProducts({}, { filterBy: [ { order: 'EQ', field: 'title', value: 'Pen' } ] }, {}, {});
        
        expect(products).toHaveLength(2);

        for(let product of products) {
            expect(product.title).toBe('Pen');
        }
    });
});