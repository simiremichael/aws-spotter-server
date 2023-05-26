import express from 'express';
import multer from 'multer';

import { signin, signup, refresh, awsUpload, generateCompanyOTP, resetCompanyPassword, logout, getCompanies, getCompany } from '../controllers/companyController.js';

const companyRoute = express.Router();

const storage = multer.memoryStorage()
   const upload = multer({ storage: storage })

companyRoute.post('/signin', signin);
companyRoute.post('/upload', upload.single('picture'), awsUpload);
companyRoute.post('/signup', signup);
companyRoute.get('/refresh', refresh)
companyRoute.get('/', getCompanies)
companyRoute.get('/:id', getCompany)
companyRoute.post('/logout', logout)
companyRoute.patch('/generateOTP', generateCompanyOTP)
companyRoute.patch('/resetPassword', resetCompanyPassword)

export default companyRoute;