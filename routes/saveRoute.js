import express from 'express';
import userAuth from '../middleware/userAuth.js'
import {saveProperty, deleteSaveProperty, getSaveProperty} from '../controllers/saveController.js'

const saveRoute = express.Router();

saveRoute.post('/savedProperty', userAuth, saveProperty);
saveRoute.delete('/savedProperty/:id', userAuth, deleteSaveProperty);
saveRoute.get('/savedProperties', getSaveProperty)

export default saveRoute;