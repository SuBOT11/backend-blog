import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    blogId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required:true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },

},

    {timestamps:true}
);


const Like = mongoose.model('Like', LikeSchema)
export default Like ;