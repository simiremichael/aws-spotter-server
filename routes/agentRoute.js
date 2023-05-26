import express from 'express';
import { signin, signup, refresh, awsUpload, generateAgentOTP, resetAgentPassword, logout, getAgentCompany, updateAgent ,deleteAgent, getAgent, getAgents} from '../controllers/agentController.js';
import companyAuth from '../middleware/companyAuth.js';
import multer from 'multer';

const agentRoute = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

agentRoute.post('/signin', signin);
agentRoute.post('/upload', upload.single('picture'), awsUpload);
agentRoute.post('/signup', companyAuth, signup);
agentRoute.get('/refresh', refresh);
agentRoute.post('/logout', logout);
agentRoute.get('/:id', getAgent);
agentRoute.get('/', getAgents);
agentRoute.patch('/:id', updateAgent);
agentRoute.delete('/:id', deleteAgent);
agentRoute.get('/agentCompany/:id', getAgentCompany );
agentRoute.patch('/generateOTP', generateAgentOTP)
agentRoute.patch('/resetPassword', resetAgentPassword)


export default agentRoute;

// companyAuth,