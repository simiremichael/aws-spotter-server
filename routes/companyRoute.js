import express from 'express';

import { signin, signup, refresh, generateCompanyOTP, resetCompanyPassword, logout, getCompanies, getCompany } from '../controllers/companyController.js';

const companyRoute = express.Router();

companyRoute.post('/signin', signin);
companyRoute.post('/signup', signup);
companyRoute.get('/refresh', refresh)
companyRoute.get('/', getCompanies)
companyRoute.get('/:id', getCompany)
companyRoute.post('/logout', logout)
companyRoute.patch('/generateOTP', generateCompanyOTP)
companyRoute.patch('/resetPassword', resetCompanyPassword)

export default companyRoute;