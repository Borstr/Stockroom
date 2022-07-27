import { Order, OrderBy } from './types';

function dataFilter(data:[OrderBy]) {
    const filterData:any = {};

    for(let i = 0; i < data.length; i++) {
        const { order, field, value }:OrderBy = data[i];
        const valueField:Order = {};
        valueField[order === 'ASC' ? '$gt' : '$lt'] = value;
        filterData[field] = valueField;
    }

    return filterData;
}

function dataSorter(data:[OrderBy]) {
    const sortData:any = {};

    for(let i = 0; i < data.length; i++) {
        const { order, field }:OrderBy = data[i];
        sortData[field] = order === 'ASC' ? 1 : -1;
    }

    return sortData;
}

export { dataFilter, dataSorter }