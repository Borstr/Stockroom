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
    await TaskModel.deleteMany({});
    await ProductModel.deleteMany({});
});

afterAll(async () => {
    await TaskModel.deleteMany({});
    await ProductModel.deleteMany({});
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
            
            if(task) expect(task.products).toHaveLength(1);
        }
    });

    it('should throw an error if ID is missing', async () => {
        try {
            await taskResolvers.Query.getTask({}, { id: '' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing task ID. [TASK]'));
        }
    });

    it('should throw an error if ID is incorrect', async () => {
        try {
            await taskResolvers.Query.getTask({}, { id: '12345678901234567890123' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect ID. [TASK]'));
        }
    });

    it('should throw an error when there is no task with a given ID', async () => {
        try {
            await taskResolvers.Query.getTask({}, { id: '123456789012345678901234' }, {}, {});
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No task with a given ID. [TASK]'));
        }
    });
});

describe('getTasks resolver', () => {
    it('should find 4 tasks', async () => {
        const tasks: Task[] | null = await taskResolvers.Query.getTasks();

        expect(tasks).not.toBe(null);
        expect(tasks).toHaveLength(4);
    });

    it('should throw an error when there are no tasks', async () => {
        await TaskModel.deleteMany();

        try {
            await taskResolvers.Query.getTasks();
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('No tasks found. [TASK]'));
        }
    });
});

describe('createTask resolver', () => {
    it('should create task with the given data', async () => {
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

            if(task && task.products) {
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

    it('should throw an error if title is missing', async () => {
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
            expect(err).toStrictEqual(new UserInputError('Missing required field (title). [TASK]'));
        }
    });

    it('should throw an error if entryDate is missing', async () => {
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
            expect(err).toStrictEqual(new UserInputError('Missing required field (entryDate). [TASK]'));
        }
    });

    it('should throw an error if finishDate is missing', async () => {
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
            expect(err).toStrictEqual(new UserInputError('Missing required field (finishDate). [TASK]'));
        }
    });

    it('should throw an error if there are no products', async () => {
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
            expect(err).toStrictEqual(new UserInputError('Missing required field (products). [TASK]'));
        }
    });
});

describe('updateTask resolver', () => {
    it('should update task with a given ID', async () => {
        const task: Task | null = await TaskModel.findOne();

        const updatedTask: Task | null = await taskResolvers.Mutation.updateTask(
            {},
            {
                task: {
                    id: task ? task.id : '',
                    title: 'New title'
                }
            },
            {},
            {}
        );

        expect(task?.title).not.toBe(updatedTask?.title);
    });

    it('should throw an error if ID is incorrect', async () => {
        try {
            await taskResolvers.Mutation.updateTask(
                {},
                {
                    task: {
                        id: '1',
                        title: 'New title'
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect ID. [TASK]'));
        }
    });

    it('should throw an error if there is no data provided to update', async () => {
        try {
            await taskResolvers.Mutation.updateTask(
                {},
                {
                    task: {
                        id: '123456789012345678901234'
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Missing update data. [TASK]'));
        }
    });

    it('should throw an error if there is no task with a given ID', async () => {
        try {
            await taskResolvers.Mutation.updateTask(
                {},
                {
                    task: {
                        id: '123456789012345678901234',
                        title: 'New title'
                    }
                },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('We couldn\'find a task with a given ID. [TASK]'));
        }
    });
});

describe('deleteTask resolver', () => {
    it('should delete task with a given ID', async () => {
        const taskToDelete: Task | null = await TaskModel.findOne();

        const deletedTask: Task | null = await taskResolvers.Mutation.deleteTask(
            {},
            { id: taskToDelete ? taskToDelete.id : '' },
            {},
            {}
        );

        const task: Task | null = await TaskModel.findById(taskToDelete ? taskToDelete.id : '');
        
        expect(deletedTask).not.toBe(null);
        expect(task).toBe(null);
    });

    it('should throw an error if ID is incorrect', async () => {
        try {
            const deletedTask: Task | null = await taskResolvers.Mutation.deleteTask(
                {},
                { id: '1' },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('Incorrect ID. [TASK]'));
        }
    });

    it('should throw an error if there is no task with a given ID', async () => {
        try {
            const deletedTask: Task | null = await taskResolvers.Mutation.deleteTask(
                {},
                { id: '123456789012345678901234' },
                {},
                {}
            );
        } catch(err) {
            expect(err).toStrictEqual(new UserInputError('We couldn\'find a task with a given ID. [TASK]'));
        }
    });
});