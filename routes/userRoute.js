import express from 'express';
import multer from 'multer';

import {  updateUser, deleteUser, generateOTP, awsUpload, resetPassword, signin, signup, googleSignIn, refresh, logout } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRoute = express.Router();

const storage = multer.memoryStorage()
   const upload = multer({ storage: storage })

userRoute.post('/signin', signin);
userRoute.post('/signup', signup);
userRoute.post('/upload', upload.single('picture'), awsUpload);
userRoute.post("/googleSignIn", googleSignIn);
userRoute.get('/refresh', refresh)
userRoute.post('/logout', logout)
userRoute.patch('/generateOTP', generateOTP)
userRoute.patch('/update/:id', userAuth, updateUser)
userRoute.patch('/resetPassword', resetPassword)
userRoute.delete('/delete/:id', userAuth, deleteUser)
export default userRoute;