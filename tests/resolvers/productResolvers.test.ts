import { UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productResolvers from '../../src/graphql/resolvers/productResolvers';
import ProductModel from '../../src/models/Product.model';
import { Product } from '../../src/types';

import { productData } from '../mockData';

dotenv.config();
const DBPassword = process.env.MONGODB_PASSWORD;

beforeAll(async () => {
    await mongoose.connect(`mongodb+srv://Nadrek:${DBPassword}@cluster0.feu7b.mongodb.net/Test?retryWrites=true&w=majority`);
});

beforeEach(async () => {
    await ProductModel.create(productData);
});

afterEach(async () => {
    await ProductModel.deleteMany();
});

afterAll(async () => {
    await ProductModel.deleteMany();
    await mongoose.disconnect();
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
        expect(product).toHaveProperty('height');
        expect(product).toHaveProperty('imagePath');
    });

    it('should throw an error when ID is missing', async () => {
        try {
            await productResolvers.Query.getProduct({}, { id: '' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing product ID. [PRODUCT]'));
        }
    });

    it('should throw an error when ID is incorrect', async () => {
        try {
            await productResolvers.Query.getProduct({}, { id: 'abc' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect ID. [PRODUCT]'));
        }
    });

    it('should throw an error if there is no user with a given ID', async () => {
        try {
            await productResolvers.Query.getProduct({}, { id: '62e11d5bc9a34411570b4a4b' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No product with a given ID. [PRODUCT]'));
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
    it('should show products equal to filter setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getFilteredProducts({}, { filterBy: [ { order: 'EQ', field: 'title', value: 'Pen' } ] }, {}, {});
        
        expect(products).toHaveLength(2);

        for(let product of products) {
            expect(product.title).toBe('Pen');
        }
    });

    it('should show products lower, than filter setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getFilteredProducts({}, { filterBy: [ { order: 'ASC', field: 'inStock', value: '1' } ] }, {}, {}); 

        expect(products).toHaveLength(3);
        
        for(let product of products) {
            expect(product.inStock).toBeGreaterThan(1);
        }
    });

    it('should show products higher, than filter setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getFilteredProducts({}, { filterBy: [ { order: 'DESC', field: 'inStock', value: '3' } ] }, {}, {})
        
        expect(products).toHaveLength(2);

        for(let product of products) {
            expect(product.inStock).toBeLessThan(3);
        }
    });

    it('should show products with multiple filter settings', async () => {
        const products: Product[] | null = await productResolvers.Query.getFilteredProducts(
            {}, 
            { 
                filterBy: [ 
                    { order: 'DESC', field: 'inStock', value: '4' },
                    { order: 'DESC', field: 'inDelivery', value: '4' } 
                ]
            }, 
            {}, 
            {}
        );

        expect(products).toHaveLength(2);

        for(let product of products) {
            expect(product.inStock).toBeGreaterThan(1);
            expect(product.inDelivery).toBeLessThan(4);
        }
    });

    it('should show products with given filter and sort setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getFilteredProducts(
            {},
            {
                filterBy: [{ order: 'DESC', field: 'inStock', value: '4' }],
                sortBy: [{ order: 'ASC', field: 'inDelivery' }]
            },
            {},
            {}
        );

        expect(products).toHaveLength(3);
        
        products.map((product: Product, i: number) => expect(product.inDelivery).toBeGreaterThan(Number((i - 1) > 0 ? products[i - 1].inDelivery : 0)));
    });

    it('should throw an error if there is filter setting missing', async () => {
        try {
            await productResolvers.Query.getFilteredProducts(
                {},
                { filterBy: [] },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing filter data. [PRODUCT]'));
        }
    });
});

describe('getSortedProducts resolver', () => {
    it('should show products lower, than sort setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getSortedProducts({}, { sortBy: [{ field: 'inDelivery', order: 'DESC' }] }, {}, {});

        expect(products).toHaveLength(4);

        products.map((product: Product, i: number) => expect(product.inDelivery).toBeLessThan(Number((i - 1) > 0 ? products[i - 1].inDelivery : 5)));
    });

    it('should show products higher, than sort setting', async () => {
        const products: Product[] | null = await productResolvers.Query.getSortedProducts({}, { sortBy: [{ field: 'inDelivery', order: 'ASC' }] }, {}, {});

        expect(products).toHaveLength(4);

        products.map((product: Product, i: number) => expect(product.inDelivery).toBeGreaterThan(Number((i - 1) > 0 ? products[i - 1].inDelivery : 0)));
    });

    it('should show products with multiple sort settings', async () => {
        const products: Product[] | null = await productResolvers.Query.getSortedProducts(
            {}, 
            { sortBy: [
                { field: 'inDelivery', order: 'ASC' },
                { field: 'inStock', order: 'DESC' }
            ]}, 
            {}, 
            {}
        );

        expect(products).toHaveLength(4);

        products.map((product: Product, i: number) => expect(product.inDelivery).toBeGreaterThan(Number((i - 1) > 0 ? products[i - 1].inDelivery : 0)));
        products.map((product: Product, i: number) => expect(product.inStock).toBeLessThan(Number((i - 1) > 0 ? products[i - 1].inStock : 5)));
    });

    it('should show products with given sort and filter settings', async () => {
        const products: Product[] | null = await productResolvers.Query.getSortedProducts(
            {}, 
            { 
                sortBy: [{ field: 'inDelivery', order: 'ASC' }],
                filterBy: [{ order: 'DESC', field: 'inStock', value: '4' }]
            }, 
            {}, 
            {}
        );

        expect(products).toHaveLength(3);
        
        products.map((product: Product, i: number) => expect(product.inDelivery).toBeGreaterThan(Number((i - 1) > 0 ? products[i - 1].inDelivery : 0)));
    });
    
    it('should throw an error if there is no sort setting', async () => {
        try {
            await productResolvers.Query.getSortedProducts({}, { sortBy: [] }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing sorting data. [PRODUCT]'));
        }
    });
});

describe('createProduct resolver', () => {
    it('should create a new product', async () => {
        const newProduct: Product | null = await productResolvers.Mutation.createProduct(
            {}, 
            { 
                product: { 
                    title: 'Pen', 
                    color: 'Orange',
                    model: 'Lio',
                    width: 3,
                    length: 5,
                    height: 4,
                    imagePath: 'test',
                    inStock: 10,
                    inDelivery: 11
                }
            }, 
            {}, 
            {}
        );

        const product: Product | null = await ProductModel.findById(newProduct.id);

        expect(newProduct).not.toBe(null);
        expect(product).not.toBe(null);

        expect(newProduct.color).toBe('Orange');
        expect(newProduct.title).toBe('Pen');
        expect(newProduct.model).toBe('Lio');
        expect(newProduct.width).toBe(3);
        expect(newProduct.length).toBe(5);
        expect(newProduct.height).toBe(4);
        expect(newProduct.imagePath).toBe('test');
        expect(newProduct.inStock).toBe(10);
        expect(newProduct.inDelivery).toBe(11);
    });

    it('should throw an error if there are missing essential fields', async () => {
        try {
            await productResolvers.Mutation.createProduct({}, { product: {}}, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing required fields. [PRODUCT]'));
        }
    });
});

describe('updateProduct resolver', () => {
    it('should update product with a given ID', async () => {
        const product: Product | null = await ProductModel.findOne({});

        const updatedProduct: Product | null = await productResolvers.Mutation.updateProduct(
            {}, 
            { 
                product: { 
                    title: 'Test', 
                    id: product ? product.id : '0' 
                }
            }, 
            {}, 
            {}
        );

        expect(updatedProduct).not.toBe(null)

        if(updatedProduct && product) {
            expect(updatedProduct.title).toBe('Test');
            expect(updatedProduct.model).toBe(product.model);
            expect(updatedProduct.length).toBe(product.length);
            expect(updatedProduct.height).toBe(product.height);
            expect(updatedProduct.width).toBe(product.width);
            expect(updatedProduct.imagePath).toBe(product.imagePath);
            expect(updatedProduct.color).toBe(product.color);
            expect(updatedProduct.inStock).toBe(product.inStock);
            expect(updatedProduct.inDelivery).toBe(product.inDelivery);
        }
    });

    it('should throw an error if there is no product with a given ID', async () => {
        try {
            await productResolvers.Mutation.updateProduct(
                {}, 
                { 
                    product: { 
                        title: 'Test', 
                        id: '123456789012345678901234'
                    }
                }, 
                {}, 
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('We couldn\'find a product with a given ID. [PRODUCT]'));
        }
    });

    it('should throw an error if provided ID is incorrect', async () => {
        try {
            await productResolvers.Mutation.updateProduct(
                {}, 
                { 
                    product: { 
                        id: 'a'
                    }
                }, 
                {}, 
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect ID. [PRODUCT]'));
        }
    });

    it('should throw an error if there is no data for update', async () => {
        try {
            await productResolvers.Mutation.updateProduct(
                {}, 
                { 
                    product: { 
                        id: '123456789012345678901234'
                    }
                }, 
                {}, 
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing update data. [PRODUCT]'));
        }
    });
});

describe('deleteProduct resolver', () => {
    it('should delete product with a given ID', async () => {
        const newProduct: Product | null = await ProductModel.create({ title: 'Test', color: 'red' });

        if(newProduct && newProduct.id) {
            await productResolvers.Mutation.deleteProduct({}, { id: newProduct.id }, {}, {});
            
            const deletedProduct = await ProductModel.findById(newProduct.id);
            expect(deletedProduct).toBe(null);
        }
    });

    it('shoould throw an error if there is no product with a given ID', async () => {
        try {
            await productResolvers.Mutation.deleteProduct(
                {}, 
                { 
                    id: '123456789012345678901234'
                }, 
                {}, 
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('We couldn\'find a product with a given ID. [PRODUCT]'));
        }
    });

    it('should throw an error if provided ID is incorrect', async () => {
        try {
            await productResolvers.Mutation.deleteProduct(
                {}, 
                { 
                    id: '1'
                }, 
                {}, 
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect ID. [PRODUCT]'));
        }
    });
});