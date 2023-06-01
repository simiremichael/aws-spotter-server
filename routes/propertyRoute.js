import express from 'express';
import { getPropertyBySearch, moreProperty, getProperties, 
createProperty, updateProperty, deleteProperty, getProperty,
 getPropertyByAgent, companyPropertySearch, getPropertyBySearchByBuy, 
 getPropertyBySearchByRent, newProject, offplan, awsUpload, commercial, companyProperties, getPropertyByNativeSearch, getNativePropertyByAgent} 
  from '../controllers/propertyController.js';
import agentAuth from '../middleware/agentAuth.js';
import multer from 'multer';
   
const propertyRoute = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

propertyRoute.get('/nativesearch', getPropertyByNativeSearch);
propertyRoute.get('/search', getPropertyBySearch);
propertyRoute.get('/buy', getPropertyBySearchByBuy);
propertyRoute.get('/rent', getPropertyBySearchByRent);
propertyRoute.get('/commercial', commercial); 
propertyRoute.get('/newProject', newProject); 
propertyRoute.get('/offplan', offplan);
propertyRoute.get('/more', moreProperty);
propertyRoute.get('/', getProperties);
propertyRoute.post('/', agentAuth, createProperty);
propertyRoute.get('/:id', getProperty );
propertyRoute.patch('/:id', updateProperty);
propertyRoute.delete('/:id', deleteProperty);
propertyRoute.get('/agentProperties/:id', agentAuth, getPropertyByAgent);
propertyRoute.get('/nativeAgentProperties/:id', getNativePropertyByAgent);
propertyRoute.get('/adminHomepage/propertyList/:id', companyPropertySearch); 
propertyRoute.get('/companyProperties/:id', companyProperties);
propertyRoute.post('/upload', upload.single('picture'), awsUpload);
//propertyRoute.post('/delete/:id',  awsDelete);

export default propertyRoute;   