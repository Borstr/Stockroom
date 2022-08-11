import { UserInputError } from 'apollo-server-express';
import TaskModel from "../../models/Task.model";
import ProductModel from '../../models/Product.model';
import { Task, Product, ProductInDemand } from '../../types';

const taskResolvers = {
    Query: {
        getTask: async (parent: any, { id }: { id: string }, context: any, info: any) => {
            if(!id) throw new UserInputError('Missing task ID. [TASK]');
            if(id.length !== 24) throw new UserInputError('Incorrect ID. [TASK]');

            const task: Task | null = await TaskModel.findById(id).populate('products.product');

            if(!task) throw new UserInputError('No task with a given ID. [TASK]');

            return task;
        },
        getTasks: async () => {
            const tasks: Task[] | null = await TaskModel.find({}).populate('products.product');

            if(tasks.length === 0) throw new UserInputError('No tasks found. [TASK]');

            return tasks;
        }
    },
    Mutation: {
        createTask: async (parent: any, { task: { title, entryDate, finishDate, products }}: { task: Task }, context: any, info: any) => {
            if(!title) throw new UserInputError('Missing title. [TASK]');
            if(!entryDate) throw new UserInputError('Missing entry date. [TASK]');
            if(!finishDate) throw new UserInputError('Missing finish date. [TASK]');
            if(!products || products.length < 1) throw new UserInputError('Missing products. [TASK]');
            
            const task: Task | null = await (await TaskModel.create({ title, entryDate, finishDate, products })).populate('products.product');

            return task;
        },
        updateTask: async (
            parent: any, 
            { task }: { task: Task }, 
            context: any, 
            info: any
        ) => {
            if(task && task.id && task.id.length < 24) throw new UserInputError('Incorrect ID. [TASK]');

            const updatedTaskFields: any = {};
            const taskKeys: string[] = Object.keys(task);

            if(taskKeys.length <= 1) throw new UserInputError('Missing update data. [TASK]');

            for(let i = 0; i < taskKeys.length; i++) {
                const taskKey: string = taskKeys[i];
                if(taskKey !== 'id') updatedTaskFields[taskKey] = task[taskKey as keyof Task];
            }

            const updatedTask: Task | null = await TaskModel.findByIdAndUpdate(task.id, updatedTaskFields, { new: true }).populate('products.product');

            if(!updatedTask) throw new UserInputError('We couldn\'find a task with a given ID. [TASK]');

            return updatedTask;
        },
        deleteTask: async (parent: any, { id }: { id: string }, context: any, info: any) => {
            if(id && id.length < 24) throw new UserInputError('Incorrect ID.');

            const deletedTask: Task | null = await TaskModel.findByIdAndDelete(id);

            if(!deletedTask) throw new UserInputError('We couldn\'find a task with a given ID. [TASK]');

            return deletedTask;
        }
    }
}

export default taskResolvers;