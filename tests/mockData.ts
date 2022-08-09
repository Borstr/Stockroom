import { Task, Product } from "../src/types";

const taskData: Task[] = [
    { 
        id: '12345678901234567890123a',
        title: 'Task', 
        products: [{
            product: '12345678901234567890123a',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    },
    { 
        id: '12345678901234567890123c',
        title: 'Task2', 
        products: [{
            product: '12345678901234567890124c',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    },
    { 
        id: '12345678901234567890123b',
        title: 'Task3', 
        products: [{
            product: '12345678901234567890124b',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    },
    { 
        id: '12345678901234567890123d',
        title: 'Task4', 
        products: [{
            product: '12345678901234567890124d',
            amount: 100
        }],
        entryDate: '02.08.2022',
        finishDate: '03.08.2022'
    }
];

const productData: Product[] = [
    {
        id: '',
        title: 'Pen',
        model: 'Lio',
        color: 'Red',
        inStock: 4,
        inDelivery: 1,
        width: 3,
        length: 4,
        height: 20,
        imagePath: 'test'
    },
    {
        id: '',
        title: 'Pen',
        model: 'Lio white',
        color: 'Blue',
        inStock: 3,
        inDelivery: 2,
        width: 3,
        length: 4,
        height: 15,
        imagePath: 'test'
    },
    {
        id: '',
        title: 'Bag',
        model: 'Lio white',
        color: 'Blue',
        inStock: 1,
        inDelivery: 4,
        width: 3,
        length: 4,
        height: 11,
        imagePath: 'test'
    },
    {
        id: '',
        title: 'Lighter',
        model: 'Lio white',
        color: 'Blue',
        inStock: 2,
        inDelivery: 3,
        width: 3,
        length: 4,
        height: 10,
        imagePath: 'test'
    }
];

export {
    productData,
    taskData
}