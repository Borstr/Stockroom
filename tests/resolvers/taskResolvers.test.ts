import { UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import taskResolvers from '../../src/graphql/resolvers/taskResolvers';
import TaskModel from '../../src/models/Task.model';
import ProductModel from '../../src/models/Product.model';
import { Task, Product } from '../../src/types';

import { productData, taskData } from '../mockData';

dotenv.config();
const DBPassword = process.env.MONGODB_PASSWORD;

beforeAll(async () => {
    await mongoose.connect(`mongodb+srv://Nadrek:${DBPassword}@cluster0.feu7b.mongodb.net/Test?retryWrites=true&w=majority`);
});

beforeEach(async () => {
    await TaskModel.create(taskData);
    await ProductModel.create(productData);
});

afterEach(async () => {
    await TaskModel.deleteMany();
    await ProductModel.deleteMany();
});

afterAll(async () => {
    await TaskModel.deleteMany();
    await ProductModel.deleteMany();
    await mongoose.disconnect();
});

describe('getTask resolver', () => {
    it('should return one task', async () => {
        const newTask: Task | null = await TaskModel.findOne({});

        if(newTask) {
            const task: Task | null = await taskResolvers.Query.getTask({}, { id: newTask.id }, {}, {});

            expect(task).not.toBe(null);

            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('products');
            expect(task).toHaveProperty('entryDate');
            expect(task).toHaveProperty('finishDate');
            
            expect(task.products).toHaveLength(1);
        }
    });

    it('throws error when id is missing', async () => {
        try {
            await taskResolvers.Query.getTask({}, { id: '' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing task id.'));
        }
    });

    it('throws error when id is incorrect', async () => {
        try {
            await taskResolvers.Query.getTask({}, { id: '12345678901234567890123' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect id.'));
        }
    });

    it('throws error when there is no task with a given id', async () => {
        try {
            await taskResolvers.Query.getTask({}, { id: '123456789012345678901234' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No task with a given id.'));
        }
    });
});

describe('getTasks resolver', () => {
    it('should find 4 tasks', async () => {
        const tasks: Task[] | null = await taskResolvers.Query.getTasks();

        expect(tasks).not.toBe(null);
        expect(tasks).toHaveLength(4);
    });

    it('throws error when there are no tasks', async () => {
        await TaskModel.deleteMany();

        try {
            await taskResolvers.Query.getTasks();
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No tasks found.'));
        }
    });
});

describe('createTask resolver', () => {
    it('should create task with given data', async () => {
        const product: Product | null = await ProductModel.findOne();
        
        if(product && product.id) {
            const newTask: Task | null = await taskResolvers.Mutation.createTask(
                {}, 
                {
                    task: {
                        id: '',
                        title: 'Test',
                        entryDate: '05.08.2022',
                        finishDate: '05.08.2022',
                        products: [{
                            product: product.id,
                            amount: 100
                        }]
                    }
                },
                {},
                {}
            );
    
            const task: Task | null = await TaskModel.findById(newTask.id).populate('products.product');
    
            expect(newTask).not.toBe(null);
            expect(task).not.toBe(null);

            if(task) {
                expect(task.products[0].product).toHaveProperty('title');
                expect(task.products[0].product).toHaveProperty('color');
                expect(task.products[0].product).toHaveProperty('model');
                expect(task.products[0].product).toHaveProperty('inStock');
                expect(task.products[0].product).toHaveProperty('inDelivery');
                expect(task.products[0].product).toHaveProperty('width');
                expect(task.products[0].product).toHaveProperty('length');
                expect(task.products[0].product).toHaveProperty('height');

                expect(newTask.id).toBe(task.id);
            }
        }
    });

    it('throws error if title is missing', async () => {
        try {
            const product: Product | null = await ProductModel.findOne();

            await taskResolvers.Mutation.createTask(
                {}, 
                {
                    task: {
                        id: '',
                        title: '',
                        entryDate: '05.08.2022',
                        finishDate: '05.08.2022',
                        products: [{
                            product: (product && product.id) ? product.id : '',
                            amount: 100
                        }]
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing title.'));
        }
    });

    it('throws error if entry date is missing', async () => {
        try {
            const product: Product | null = await ProductModel.findOne();

            await taskResolvers.Mutation.createTask(
                {}, 
                {
                    task: {
                        id: '',
                        title: 'Test',
                        entryDate: '',
                        finishDate: '05.08.2022',
                        products: [{
                            product: (product && product.id) ? product.id : '',
                            amount: 100
                        }]
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing entry date.'));
        }
    });

    it('throws error if finish date is missing', async () => {
        try {
            const product: Product | null = await ProductModel.findOne();

            await taskResolvers.Mutation.createTask(
                {}, 
                {
                    task: {
                        id: '',
                        title: 'Test',
                        entryDate: '05.08.2022',
                        finishDate: '',
                        products: [{
                            product: (product && product.id) ? product.id : '',
                            amount: 100
                        }]
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing finish date.'));
        }
    });

    it('throws error if there are no products', async () => {
        try {
            await taskResolvers.Mutation.createTask(
                {}, 
                {
                    task: {
                        id: '',
                        title: 'Test',
                        entryDate: '05.08.2022',
                        finishDate: '05.08.2022',
                        products: []
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing products.'));
        }
    });
});

describe('updateTask resolver', () => {
    it('should update task with a given id', async () => {
        const task: Task | null = await TaskModel.findOne();

        const updatedTask: Task | null = await taskResolvers.Mutation.updateTask()
    });

    it('throws error if id is incorrect', async () => {

    });

    it('throws error if there is no data provided to update', async () => {

    });

    it('throws error if there is no task with a given id', async () => {

    });
});

describe('deleteTask resolver', () => {

});