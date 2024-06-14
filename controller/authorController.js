import asyncHandler from 'express-async-handler'
import { AuthorModel } from '../models/authorModel.js'

const getAuthor = asyncHandler(async (req, res) => {
  const authors = await AuthorModel.find()
  res.status(200).json(authors)
})

const getAuthorById = asyncHandler(async (req, res) => {
  const author = await AuthorModel.findById(req.params.id)

  if (!author) {
    throw new Error('There is no author with id ' + req.params.id)
  } else {
    res.status(200).json({'author' : author})
  }
})

const createAuthor = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { nickName, email } = req.body

  try{
    const user = req.user;
    if (user.authorProfile)
      {
        return res.status(400).send({
          error: 'Author profile already exists'

        })
      }

      const author = new AuthorModel({
      _id: user._id,
      nickName,
      email
    });
    await author.save();

    // Update user to reference the new author profile
    user.authorProfile = author._id;
    await user.save();

    res.status(201).send({ message: 'Author profile created', author });
  } catch (error) {
    res.status(500).send(error);
  }
  });


const updateAuthor = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body
  if (!email || !fullName) {
    res.status(400)
    throw new Error('Please add all required  fields')
  }

  const author = await AuthorModel.findById(req.params.id)

  if (!author) {
    res.status(400)
    throw new Error('Invalid Author Data')
  } else {
    author.fullName = fullName
    author.email = email
    const updatedAuthor = author.save()
    res.status(201).json(updatedAuthor)
  }
})

const deleteAuthor = asyncHandler(async (req, res) => {
  const blog = await AuthorModel.findById(req.params.id)

  if (blog) {
    await AuthorModel.findByIdAndDelete(req.params.id)
    res.json({ messsage: 'Removed' })
  } else {
    res.status(404)
    throw new Error('Not Found')
  }
})

export { getAuthor, updateAuthor, getAuthorById, createAuthor, deleteAuthor }
