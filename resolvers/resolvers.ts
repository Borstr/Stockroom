import Post, { PostInterface } from '../models/Post.model';

const resolvers = {
    Query: {
        hello: () => 'Hello World',
        getAllPosts: async () => await Post.find()
    },
    Mutation: {
        createPost: async (parent:any, args: { post:PostInterface }, context:any, info:any) => {
            const { title, description } = args.post;
            const post = new Post({title, description});
            console.log(args)
            await post.save();
            return post; 
        }
    }
}

export default resolvers;