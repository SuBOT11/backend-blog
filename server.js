/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import colors from 'colors'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorMiddleware.js'
import authorRoutes from './routes/authorRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config()

// database connected
connectDB()

// Node app initiated
const app = express()
app.use(bodyParser.json())
const __dirname = path.resolve()
// create application/x-www-form-urlencoded parser
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(

  {
  origin : ['http://192.168.1.72:5173', 'http://localhost:5173'],
  methods: 'GET,POST,PUT,DELETE',
  credentials:true,

  }
))

app.use(morgan('dev'))
  

app.get('/home', (req, res) => {
  res.send('Api is running')
})

app.get('/', (req, res) => {
  res.send('Api running...')
})

app.use('/auth', authRoutes);
app.use('/api/author/', authorRoutes)
app.use('/api/blog/', blogRoutes)
app.use('/api/comment/', commentRoutes)
app.use(errorHandler)
// const port
const PORT = process.env.PORT || 8232

app.listen(PORT, '0.0.0.0',() => {
  console.log(
    `Server is running in mode on port ${PORT}`.yellow
      .italic
  )
})
