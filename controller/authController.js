import {User} from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { networkInterfaces } from 'os';


const generateAccessToken = (user) => {
  console.log(user.role)
  return jwt.sign(
    { userId: {
      email: user.email,
      name: user.name,
      id: user._id,
      role: user.role
    }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
     process.env.REFRESH_TOKEN_SECRET);
};

export const register = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password ,role} = req.body;
    const user = new User({ name, email, password ,role});
    await user.save();
    res.status(201).send({ message: 'User registered successfully. Proceed to Login' });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken',refreshToken,{httpOnly:true,secret:true});
    res.json({accessToken});


  } catch (error) {
    res.status(500).send(error);
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken)

  if (!refreshToken) return res.status(401).send('Unauthorized');

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).send('Forbidden');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).send('Forbidden');
  }
};

