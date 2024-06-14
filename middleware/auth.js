import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';


export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.userId.id);
    console.log(user)
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

export const  authorizeRole = (roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return res.sendStatus(403);
    }
    next();
  }

}
