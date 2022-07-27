interface OrderBy {
    field: any;
    order: String;
    value?: String;
}

interface Order {
    $gt?: String;
    $lt?: String;
    $gte?: String;
    $lte?: String;
    $eq?: String;
}

interface ProductType {
    title?: String;
    color?: String;
    inStock?: Number;
    inDelivery?: Number;
    width?: Number;
    length?: Number
    imagePath?: String;
    id?: String;
}

export { 
    OrderBy, 
    Order, 
    ProductType 
}