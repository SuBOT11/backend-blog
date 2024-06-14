import express from 'express'
import {login, register,refresh} from '../controller/authController.js'

const router = express.Router();

router.route('/refresh').post(refresh)
router.route('/login').post(login)
router.route('/signup').post(register)

export default router