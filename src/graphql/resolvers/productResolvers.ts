import Product, { ProductType } from '../../models/Product.model';

const productResolvers = {
    Query: {
        getProduct: async (
            parent:any, 
            { id }:{ id:Number }, 
            context:any, 
            info:any) => await Product.findById(id),
        getAllProducts: async () => await Product.find()
    },
    Mutation: {
        createProduct: async (
            parent:any, 
            { product }:{ product:ProductType }, 
            context:any, 
            info:any
        ) => await Product.create({ ...product }),
        updateProduct: async (
            parent:any,
            { product: { id, title, color, inStock, inDelivery, size, imagePath } }:{ product:ProductType }, 
            context:any,
            onfo:any
        ) => await Product.findByIdAndUpdate(id, { title, color, inStock, inDelivery, size, imagePath }, { new: true }),
        deleteProduct: async (
            parent:any, 
            { id }:{ id:Number }, 
            context:any, 
            info:any) => Product.findByIdAndDelete(id)
    }
}

export default productResolvers;