import express from 'express';
import agentAuth from '../middleware/agentAuth.js'

import { getEvents, getEvent, bookEvent, updateEvent, deleteEvent, getAgentEvent } from '../controllers/eventController.js';

const eventRoute = express.Router();

eventRoute.get('/', getEvents); 
eventRoute.get('/:id', getEvent);
eventRoute.get('/agentEvents/:id', getAgentEvent);
eventRoute.post('/', agentAuth, bookEvent);
eventRoute.patch('/:id', updateEvent)
eventRoute.delete('/:id', deleteEvent)

export default eventRoute;