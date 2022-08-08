import { UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import taskResolvers from '../../src/graphql/resolvers/taskResolvers';
import TaskModel from '../../src/models/Task.model';
import { Task } from '../../src/types';

dotenv.config();
const DBPassword = process.env.MONGODB_PASSWORD;

const mockData: Task[] = [
    { 
        id: '12345678901234567890123a',
        title: 'Task', 
        products: [{
            product: '12345678901234567890123a',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    },
    { 
        id: '12345678901234567890123c',
        title: 'Task2', 
        products: [{
            product: '12345678901234567890124c',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    },
    { 
        id: '12345678901234567890123b',
        title: 'Task3', 
        products: [{
            product: '12345678901234567890124b',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    },
    { 
        id: '12345678901234567890123d',
        title: 'Task4', 
        products: [{
            product: '12345678901234567890124d',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    }
];

beforeAll(async () => {
    await mongoose.connect(`mongodb+srv://Nadrek:${DBPassword}@cluster0.feu7b.mongodb.net/Test?retryWrites=true&w=majority`);
});

beforeEach(async () => {
    await TaskModel.create(mockData);
});

afterEach(async () => {
    await TaskModel.deleteMany();
});

afterAll(async () => {
    await TaskModel.deleteMany();
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
        const newTask: Task | null = await taskResolvers.Mutation.createTask(
            {}, 
            {
                task: {
                    id: '',
                    title: 'Test',
                    entryDate: '05.08.2022',
                    finishDate: '05.08.2022',
                    products: [{
                        product: {
                            title: 'Pen',
                            color: 'red',
                            model: 'Lio'
                        },
                        amount: 100
                    }]
                }
            },
            {},
            {}
        );

        console.log(newTask);

        const task: Task | null = await TaskModel.findById(newTask.id);

        expect(newTask).not.toBe(null);
        expect(task).not.toBe(null);
        
        if(task) expect(newTask.id).toBe(task.id);
    });
});

describe('updateTask resolver', () => {

});

describe('deleteTask resolver', () => {

});