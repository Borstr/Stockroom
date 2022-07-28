import ProductModel from '../../models/Product.model';
import { OrderBy, Product } from '../../types';
import { filterData, sortData } from '../../helpers';
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
                    return await ProductModel.findById(id);
                } catch {
                    throw new UserInputError('We couldn\'find a product with a given ID.')
                }
            },
        getAllProducts: async () => await ProductModel.find(),
        getFilteredProducts: async (
            parent: any, 
            { filterBy, sortBy }: { filterBy: [OrderBy], sortBy?: [OrderBy] }, 
            context: any, 
            info: any
        ) => {
            if(!filterBy) throw new UserInputError('Missing filter data.');
            if(!sortBy) return ProductModel.find(filterData(filterBy));

            return ProductModel.find(filterData(filterBy)).sort(sortData(sortBy));
        },
        getSortedProducts: async (
            parent: any, 
            { sortBy, filterBy }: { sortBy: [OrderBy], filterBy?: [OrderBy] }, 
            context: any, 
            info: any
        ) => {
            if(!sortBy) throw new UserInputError('Missing sorting data.');
            if(filterBy) return ProductModel.find(filterData(filterBy)).sort(sortData(sortBy));
            return ProductModel.find({}).sort(sortData(sortBy));
        }
    },
    Mutation: {
        createProduct: async (
            parent: any, 
            { product: { color, title, model = '', inStock = 0, inDelivery = 0, width = 0, length = 0, imagePath = ''} }: { product: Product }, 
            context: any, 
            info: any
        ) => {
            if(!color || !title) throw new UserInputError('Missing required fields.');
            return await ProductModel.create({ color, title, model, inStock, inDelivery, width, length, imagePath });
        },
        updateProduct: async (
            parent: any,
            { product }: { product: Product }, 
            context: any,
            info: any
        ) => {
            const updatedProduct: any = {};
            const productKeys: string[] = Object.keys(product);

            if(productKeys.length <= 1) throw new UserInputError('Missing update data.');

            for(let i = 0; i < productKeys.length; i++) {
                const productKey: string = productKeys[i];
                if(productKey !== 'id') updatedProduct[productKey] = product[productKey as keyof Product];
            }

            try {
                return await ProductModel.findByIdAndUpdate(product.id, updatedProduct, { new: true });
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
                    return await ProductModel.findByIdAndDelete(id)
                } catch {
                    throw new UserInputError('We couldn\'find a product with a given ID.');
                }
            }
    }
}

export default productResolvers;