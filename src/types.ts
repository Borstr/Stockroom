import mongoose from 'mongoose';

interface OrderBy {
    field: any;
    order: string;
    value?: string;
}

interface Order {
    $gt?: string;
    $lt?: string;
    $gte?: string;
    $lte?: string;
    $eq?: string;
}

interface Product {
    title?: string;
    color?: string;
    model?: string;
    inStock?: number;
    inDelivery?: number;
    width?: number;
    length?: number
    imagePath?: string;
    id: string | mongoose.Types.ObjectId;
}

export { 
    OrderBy, 
    Order, 
    Product
}