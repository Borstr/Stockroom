import mongoose from 'mongoose';

export interface PostInterface {
    title: String;
    description: String;
};

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

const Post = mongoose.model('post', PostSchema);

export default Post;