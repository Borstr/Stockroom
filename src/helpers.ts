import { Order, OrderBy } from './types';

function filterData(data: [OrderBy]) {
    const filterData: any = {};

    for(let i: number = 0; i < data.length; i++) {
        const { order, field, value }: OrderBy = data[i];
        const valueField: Order = {};
        valueField[order === 'ASC' ? '$gt' : '$lt'] = value;
        filterData[field] = valueField;
    }

    return filterData;
}

function sortData(data: [OrderBy]) {
    const sortData: any = {};

    for(let i: number = 0; i < data.length; i++) {
        const { order, field }: OrderBy = data[i];
        sortData[field] = order === 'ASC' ? 1 : -1;
    }

    return sortData;
}

export { filterData, sortData }