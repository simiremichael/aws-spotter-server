import express from 'express';

import {  updateUser, deleteUser, generateOTP, resetPassword, signin, signup, googleSignIn, refresh, logout } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRoute = express.Router();

userRoute.post('/signin', signin);
userRoute.post('/signup', signup);
userRoute.post("/googleSignIn", googleSignIn);
userRoute.get('/refresh', refresh)
userRoute.post('/logout', logout)
userRoute.patch('/generateOTP', generateOTP)
userRoute.patch('/update/:id', userAuth, updateUser)
userRoute.patch('/resetPassword', resetPassword)
userRoute.delete('/delete/:id', userAuth, deleteUser)
export default userRoute;