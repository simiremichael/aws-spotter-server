import express from 'express';
import { signin, signup, refresh, generateAgentOTP, resetAgentPassword, logout, getAgentCompany, updateAgent ,deleteAgent, getAgent, getAgents} from '../controllers/agentController.js';
import companyAuth from '../middleware/companyAuth.js';

const agentRoute = express.Router();

agentRoute.post('/signin', signin);
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