import express from 'express'
const router = express.Router()
import {
  createBlog,
  getBlogById,
  getBlogs,
  likes_count_increase,
  likes_count_decrease,
  updateBlog,
  deleteBlog,
  get_likes_count,
} from '../controller/blogController.js'

import { authMiddleware } from '../middleware/auth.js'
// get methods return blog object
// post method return blog object
router.route('/').get(getBlogs).post(authMiddleware,createBlog)
// get methods incerease like count by blog Id
router.route('/likes/:id')
.get(get_likes_count)
.post(authMiddleware,likes_count_increase)// get methods decreases like count by blog Id

router.route('/dislikes/:id').get(likes_count_decrease)
// get method return blog object by id
// delete method return blog object by id
// update method return blog object by id
router.route('/:id').get(getBlogById).put(authMiddleware,updateBlog).delete(authMiddleware,deleteBlog)

export default router
