import express from 'express';

import { getScoutings, getScouting, propertyScouting, updateScouting, deleteScouting } from '../controllers/scoutingController.js';

const scoutingRoute = express.Router();

scoutingRoute.get('/', getScoutings);
scoutingRoute.get('/:id', getScouting);
scoutingRoute.post('/', propertyScouting);
scoutingRoute.patch('/:id', updateScouting)
scoutingRoute.delete('/:id', deleteScouting)

export default scoutingRoute;