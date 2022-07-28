import Product from '../../models/Product.model';
import { OrderBy, ProductType } from '../../types';
import { dataFilter, dataSorter } from '../../helpers';
import { UserInputError } from 'apollo-server-express';

const productResolvers = {
    Query: {
        getProduct: async (
            parent: any, 
            { id }: { id: string }, 
            context: any, 
            info: any
        ) => {
                if(!id) throw new UserInputError('Missing product ID.');
                try {
                    return  await Product.findById(id);
                } catch(e) {
                    throw new UserInputError('We couldn\'find a product with a given ID.')
                }
            },
        getAllProducts: async () => await Product.find(),
        getFilteredProducts: async (
            parent: any, 
            { filterBy, sortBy }: { filterBy: [OrderBy], sortBy?: [OrderBy] }, 
            context: any, 
            info: any
        ) => {
            if(!filterBy) throw new UserInputError('Missing filter argument.')
            if(!sortBy) return Product.find(dataFilter(filterBy));
            return Product.find(dataFilter(filterBy)).sort(dataSorter(sortBy));
        },
        getSortedProducts: async (
            parent: any, 
            { sortBy, filterBy }: { sortBy: [OrderBy], filterBy?: [OrderBy] }, 
            context: any, 
            info: any
        ) => {
            if(!sortBy) throw new UserInputError('Missing sorting argument.');
            if(filterBy) return Product.find(dataFilter(filterBy)).sort(dataSorter(sortBy));
            return Product.find({}).sort(dataSorter(sortBy));
        }
    },
    Mutation: {
        createProduct: async (
            parent: any, 
            { product: { color, title, inStock = 0, inDelivery = 0, width = 0, length = 0, imagePath = ''} }: { product: ProductType }, 
            context: any, 
            info: any
        ) => {
            if(!color || !title) throw new UserInputError('Missing required fields.');
            return await Product.create({ color, title, inStock, inDelivery, width, length, imagePath });
        },
        updateProduct: async (
            parent: any,
            product: ProductType, 
            context: any,
            info: any
        ) => {
            const updatedFields: ProductType = {};
            const fields: string[] = Object.keys(product);
            for(let i = 0; i < fields.length; i++) {
                if(fields[i] !== 'id') {
                    updatedFields[fields[i] as keyof ProductType] = product[fields[i]];
                }
            }
            console.log(updatedFields);
            return await Product.findByIdAndUpdate(product.id, {}, { new: true })
        },
        deleteProduct: async (
            parent:any, 
            { id }: { id: number }, 
            context:any, 
            info:any) => {
                return await Product.findByIdAndDelete(id)
            }
    }
}

export default productResolvers;