import express from 'express';
import userAuth from '../middleware/userAuth.js'
import { apply, deleteMortgage, getMortgage, getMortgages } from '../controllers/mortgageController.js';

const mortgageRoute = express.Router();

mortgageRoute.post('/', userAuth, apply);
mortgageRoute.post('/:id', deleteMortgage);
mortgageRoute.get('/', getMortgages);
mortgageRoute.get('/:id', getMortgage);

export default mortgageRoute;