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

interface Task {
    id: string,
    title: string;
    products: ProductInDemand[];
    entryDate: String | Date;
    finishDate: String | Date;
}

interface ProductInDemand {
    product: Product;
    amount: number;
}

export { 
    OrderBy, 
    Order, 
    Product,
    Task,
    ProductInDemand
}