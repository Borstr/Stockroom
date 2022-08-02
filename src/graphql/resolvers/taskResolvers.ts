import { UserInputError } from 'apollo-server-express';
import TaskModel from "../../models/Task.model";
import { Task } from '../../types';

const taskResolvers = {
    Query: {
        getTask: async (parent: any, { id }: { id: string }, context: any, info: any) => {
            if(!id) throw new UserInputError('Missing task id.');
            if(id.length !== 24) throw new UserInputError('Incorrect id.');

            const task: Task | null = await TaskModel.findById(id);

            if(!task) throw new UserInputError('No task with a given id.');

            return task;
        },
        getTasks: async () => {
            const tasks: Task[] | null = await TaskModel.find({});

            if(!tasks) throw new UserInputError('No tasks found.');

            return tasks;
        }
    },
    Mutation: {
        createTask: () => {},
        updateTask: () => {},
        deleteTask: () => {}
    }
}

export default taskResolvers;