import mongoose from 'mongoose';
import { ProductType } from '../types';

const ProductSchema = new mongoose.Schema<ProductType>({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
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
    imagePath: {
        type: String
    }
});

const Product = mongoose.model('product', ProductSchema);

export default Product;
export { ProductType };