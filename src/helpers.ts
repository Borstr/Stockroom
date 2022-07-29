import { Order, OrderBy } from './types';

function filterData(data: OrderBy[]) {
    const filterData: any = [];

    for(let i: number = 0; i < data.length; i++) {
        const { order, field, value }: OrderBy = data[i];
        const filterField: any = {};
        const valueField: Order = {};
        let orderKey: keyof Order;
        switch(order) {
            case 'ASC':
                orderKey = '$gt';
                break;
            case 'DESC':
                orderKey = '$lt';
                break;
            default:
                orderKey = '$eq';
        }

        valueField[orderKey] = value;

        filterField[field] = valueField;
        filterData.push(filterField);
    }

    return { $and: filterData};
}

function sortData(data: OrderBy[]) {
    const sortData: any = {};

    for(let i: number = 0; i < data.length; i++) {
        const { order, field }: OrderBy = data[i];
        sortData[field] = order === 'ASC' ? 1 : -1;
    }

    return sortData;
}

export { filterData, sortData }