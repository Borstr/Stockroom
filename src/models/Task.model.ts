import mongoose from 'mongoose';
import { Task } from '../types';

const TaskSchema = new mongoose.Schema<Task>({
    title: {
        type: String,
        required: true
    },
    products: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'product',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
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