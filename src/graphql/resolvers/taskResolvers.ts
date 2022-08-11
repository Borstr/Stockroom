import { UserInputError } from 'apollo-server-express';
import TaskModel from "../../models/Task.model";
import { Task} from '../../types';
import { resolverValidators } from '../../helpers';

const taskResolvers = {
    Query: {
        getTask: async (parent: any, { id }: { id: string }, context: any, info: any) => {
            resolverValidators([
                { validator: 'EXIST', errorMessage: 'Missing task ID. [TASK]', data: id },
                { validator: 'ID', errorMessage: 'TASK', data: id }
            ]);

            const task: Task | null = await TaskModel.findById(id).populate('products.product');

            resolverValidators([{ validator: 'EXIST', errorMessage: 'No task with a given ID. [TASK]', data: task }]);

            return task;
        },
        getTasks: async () => {
            const tasks: Task[] | null = await TaskModel.find({}).populate('products.product');

            resolverValidators([{ validator: 'EXIST', errorMessage: 'No tasks found. [TASK]', data: tasks }]);

            return tasks;
        }
    },
    Mutation: {
        createTask: async (parent: any, { task: { title, entryDate, finishDate, products }}: { task: Task }, context: any, info: any) => {
            resolverValidators([{
                validator: 'REQUIRED_FIELDS', 
                errorMessage: 'TASK', 
                data: {
                    object: { title, entryDate, finishDate, products },
                    fields: [ 'title', 'entryDate', 'finishDate', 'products' ]
                }
            }])
            
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
            if(id && id.length < 24) throw new UserInputError('Incorrect ID. [TASK]');

            const deletedTask: Task | null = await TaskModel.findByIdAndDelete(id);

            if(!deletedTask) throw new UserInputError('We couldn\'find a task with a given ID. [TASK]');

            return deletedTask;
        }
    }
}

export default taskResolvers;