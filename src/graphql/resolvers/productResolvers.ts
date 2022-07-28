import Product from '../../models/Product.model';
import { OrderBy, ProductType } from '../../types';
import { dataFilter, dataSorter } from '../../helpers';
import { UserInputError } from 'apollo-server-express';
import { StringDecoder } from 'string_decoder';

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
                } catch {
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
            if(!filterBy) throw new UserInputError('Missing filter data.')
            if(!sortBy) return Product.find(dataFilter(filterBy));
            return Product.find(dataFilter(filterBy)).sort(dataSorter(sortBy));
        },
        getSortedProducts: async (
            parent: any, 
            { sortBy, filterBy }: { sortBy: [OrderBy], filterBy?: [OrderBy] }, 
            context: any, 
            info: any
        ) => {
            if(!sortBy) throw new UserInputError('Missing sorting data.');
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
            { product }: { product: ProductType }, 
            context: any,
            info: any
        ) => {
            const updatedProduct: any = {};
            const fields: string[] = Object.keys(product);

            if(fields.length <= 1) throw new UserInputError('Missing update data.');

            for(let i = 0; i < fields.length; i++) {
                const productKey: string = fields[i];
                if(productKey !== 'id') updatedProduct[productKey] = product[productKey as keyof ProductType];
            }

            try {
                return await Product.findByIdAndUpdate(product.id, updatedProduct, { new: true });
            } catch {
                throw new UserInputError('We couldn\'find a product with a given ID.');
            }
        },
        deleteProduct: async (
            parent:any, 
            { id }: { id: number }, 
            context:any, 
            info:any) => {
                try {
                    return await Product.findByIdAndDelete(id)
                } catch {
                    throw new UserInputError('We couldn\'find a product with a given ID.');
                }
            }
    }
}

export default productResolvers;