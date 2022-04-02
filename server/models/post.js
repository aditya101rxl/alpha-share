import mongoose from 'mongoose';

const post_schema = mongoose.Schema({
    name: String,
    username: String,
    message: String,
    file: String,
    profilePicture: String,
    tags: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const Post = mongoose.model('Post', post_schema);

export default Post;