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
    length?: number;
    height?: number;
    imagePath?: string;
    id?: string;
}

export { 
    OrderBy, 
    Order, 
    Product
}