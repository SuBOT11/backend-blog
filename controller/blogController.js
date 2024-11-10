import asyncHandler from 'express-async-handler'
import { BlogModel } from '../models/blogModel.js'
import Comment from '../models/commentModel.js'
import { authMiddleware } from '../middleware/auth.js'
import { AuthorModel } from '../models/authorModel.js'
import Like from '../models/LikeModel.js'

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.find()

 const newBlogs =  await Promise.all
 (
  
  blogs.map(async (blog) => {
   const author = await AuthorModel.findById(blog.author)
   const comments = await Comment.find({blogId:blog._id})

   return {
     ...blog._doc,
     author,
     comments

   };
    
  
  
  })

 );  
 

  res.status(200).json(newBlogs)
})

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id)
  const comments = await Comment.find({ blogId: req.params.id })
  const author = await AuthorModel.findById(blog.author)
  blog.view_count += 1
  await blog.save()

  if (!blog) {
    throw new Error('There is no blog with id ' + req.params.id)
  } else {
    res.status(200).json({ blog, comments,author })
  }
})

const createBlog = asyncHandler(async (req, res) => {
  const { title, imageUrl,content, snippet, authorId, co_AuthorId } = req.body
  if (!title || !content || !authorId) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const blog = await BlogModel.create({
    title,
    imageUrl,
    content,
    snippet,
    author: authorId,
    co_AuthorId,
    
  })
  if (!blog) {
    res.status(400)
    throw new Error('Invalid Blog Data')
  } else {
    res.status(201).json({
      blog
    })
  }
})

const updateBlog = asyncHandler(async (req, res) => {
  const { title, imageUrl,content ,snippet } = req.body

  const blog = await BlogModel.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error('Invalid Blog Not Found')
  } else {
    blog.title = title
    blog.imageUrl = imageUrl
    blog.content = content
    blog.snippet  = snippet
    const updatedBlog = await blog.save()
    res.status(201).json(updateBlog)
  }
})

const likes_count_increase = asyncHandler(async (req, res) => {
  const {id} = req.params
  const userId = req.user.id;

  const blog = await BlogModel.findById(id);
  const userLiked = await Like.findOne({blogId:id, userId})

  if (userLiked){
    await Like.deleteOne({blogId:id, userId});
    blog.likes_count -= 1;

  }else{
    const like  = new Like({blogId: id, userId})
    await like.save();
    blog.likes_count +=1;
  }

  await blog.save();
  res.json({likes_count : blog.likes_count, userLiked: !userLiked })

})

const get_likes_count= asyncHandler(async(req,res) => {
  const {id} = req.params;
  const blog = await BlogModel.findById(id);
  const userLiked = await  Like.findOne({blogId:id, userId: req.user.id});
  res.json({likes : blog.likes_count, userLiked: !!userLiked})


})

const likes_count_decrease = asyncHandler(async (req, res) => {
  const likes = await BlogModel.findById(req.params.id)
  likes.likes_count -= 1
  await likes.save()
  res.json(likes)
})

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id)

  if (blog) {
    await Comment.deleteMany({ blogId: req.params.id })
   const d = await BlogModel.findByIdAndDelete(req.params.id)
    res.json(d)
  } else {
    res.status(404)
    throw new Error('Not Found')
  }
})

export {
  createBlog,
  getBlogs,
  getBlogById,
  likes_count_increase,
  get_likes_count,
  likes_count_decrease,
  updateBlog,
  deleteBlog,
}
