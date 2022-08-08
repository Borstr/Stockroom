import { UserInputError } from 'apollo-server-express';
import TaskModel from "../../models/Task.model";
import ProductModel from '../../models/Product.model';
import { Task, Product, ProductInDemand } from '../../types';

const taskResolvers = {
    Query: {
        getTask: async (parent: any, { id }: { id: string }, context: any, info: any) => {
            if(!id) throw new UserInputError('Missing task id.');
            if(id.length !== 24) throw new UserInputError('Incorrect id.');

            const task: Task | null = await TaskModel.findById(id).populate('products.product');

            if(!task) throw new UserInputError('No task with a given id.');

            return task;
        },
        getTasks: async () => {
            const tasks: Task[] | null = await TaskModel.find({}).populate('products.product');

            if(!tasks) throw new UserInputError('No tasks found.');

            return tasks;
        }
    },
    Mutation: {
        createTask: async (parent: any, { task: { title, entryDate, finishDate, products }}: { task: Task }, context: any, info: any) => {
            if(!title) throw new UserInputError('Missing title.');
            if(!entryDate) throw new UserInputError('Missing entry date.');
            if(!finishDate) throw new UserInputError('Missing finish date.');
            if(!products || products.length < 1) throw new UserInputError('Missing title.');

            const taskProducts: ProductInDemand[] | null = [];
            
            if(products) {
                for(let taskProduct of products) {
                    const product: Product | null = await ProductModel.findById(taskProduct.product);
                    
                    if(product) {
                        taskProducts.push({
                            product,
                            amount: taskProduct.amount
                        })
                    }
                }
            }
            
            const task: Task | null = await TaskModel.create({ title, entryDate, finishDate, products: taskProducts });

            console.log(await TaskModel.findById(task.id).populate({ path: 'products', select: 'product' }));

            return task;
        },
        updateTask: () => {},
        deleteTask: () => {}
    }
}

export default taskResolvers;