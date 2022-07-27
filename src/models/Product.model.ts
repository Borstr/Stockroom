import mongoose from 'mongoose';

interface ProductType {
    title: String;
    color: String;
    inStock: Number;
    inDelivery: Number;
    size: String;
    imagePath: String
    id: String;
};

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
        required: true
    },
    inDelivery: {
        type: Number
    },
    size: {
        type: String
    },
    imagePath: {
        type: String
    }
});

const Product = mongoose.model('product', ProductSchema);

export default Product;
export { ProductType };