import { UserInputError } from 'apollo-server-express';

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

function resolverValidators(validations: { validator: string, errorMessage: string, data: any }[]) {
    for(let validation of validations) {
        const { validator, errorMessage, data }: { validator: string, errorMessage: string, data: any } = validation;
        
        switch(validator) {
            case 'ID':
                if(!data || data.length !== 24) throw new UserInputError(`Incorrect ID. [${errorMessage}]`);
                break;
            case 'REQUIRED_FIELDS':
                const keys: any = Object.keys(data.object);
                const requiredFields: string[] = data.fields;

                for(let i = 0; i < keys.length; i++) {
                    if(!requiredFields.includes(keys[i]) || !data.object[keys[i]]) {
                        throw new UserInputError(`Missing required field (${requiredFields[i]}). [${errorMessage}]`);
                    }
                }
                break;
            case 'EXIST':
                if(!data || (data.length && data.length === 0)) throw new UserInputError(errorMessage);
                break;
            case 'UPDATE_DATA':
                if(Object.keys(data).length <= 0) throw new UserInputError(`Missing update data. [${errorMessage}]`);
                break;
            default: break;
    }
    }
}

export { filterData, sortData, resolverValidators }