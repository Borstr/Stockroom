import mongoose from 'mongoose';

const schema = mongoose.Schema({
    title: String,
    content: String
})

export default mongoose.model("Post", schema);