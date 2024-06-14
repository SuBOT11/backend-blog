import mongoose from 'mongoose'

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl :{
      type:String
    }
    ,
    content: {
      type: String,
      required: true,
    },
    snippet:{
      type: String,
      required:true,


    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Author',
    },
    co_Author: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Author',
    },
    likes_count: {
      type: Number,
      required: false,
      default: 0,
    },
    view_count: {
      type: Number,
      required: false,
      default: 0,
    },
    approved : {
      type: Boolean,
       default:false
      }
  },
  { timestamps: true }
)

export const BlogModel = mongoose.model('Blog', blogSchema)
