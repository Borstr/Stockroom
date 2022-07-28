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

interface ProductType {
    title?: string;
    color?: string;
    inStock?: number;
    inDelivery?: number;
    width?: number;
    length?: number
    imagePath?: string;
    id: string;
}

export { 
    OrderBy, 
    Order, 
    ProductType 
}