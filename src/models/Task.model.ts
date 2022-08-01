import mongoose from 'mongoose';
import { Task } from '../types';
import { ProductSchema } from './Product.model';

const TaskSchema = new mongoose.Schema<Task>({
    title: {
        type: String,
        required: true
    },
    products: [{
        child: ProductSchema,
        amount: Number
    }],
    entryDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    }
});

const TaskModel = mongoose.model('task', TaskSchema);

export default TaskModel;
export { TaskSchema }