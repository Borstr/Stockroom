import mongoose from 'mongoose';
import { Product } from '../types';

const ProductSchema = new mongoose.Schema<Product>({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    model: {
        type: String
    },
    inStock: {
        type: Number,
    },
    inDelivery: {
        type: Number
    },
    width: {
        type: Number
    },
    length: {
        type: Number
    },
    height: {
        type: Number
    },
    imagePath: {
        type: String
    }
});

const ProductModel = mongoose.model('product', ProductSchema);

export default ProductModel;
export { ProductSchema };