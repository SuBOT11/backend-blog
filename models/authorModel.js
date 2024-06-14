import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema(
  {
    _id : {
      type: mongoose.Schema.Types.ObjectId, ref:'User',
    },
    nickName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
  },
  { timestamps: true }
)

export const AuthorModel = mongoose.model('Author', authorSchema)
