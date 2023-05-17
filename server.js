import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import propertyRoute from './routes/propertyRoute.js';
import userRoute from './routes/userRoute.js' 
import companyRoute from './routes/companyRoute.js';
import agentRoute from './routes/agentRoute.js' 
import  cookieParser from'cookie-parser';
import mortgageRoute from './routes/mortgageRoute.js';
import scoutingRoute from './routes/scoutingRoute.js';
import eventRoute from './routes/eventRoute.js';
import saveRoute from './routes/saveRoute.js';

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser())

 app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000',
 'https://www.residencespotter.com']
}))

app.use('/api/properties', propertyRoute);
app.use('/api/users', userRoute);
app.use('/api/companies', companyRoute);
app.use('/api/agents', agentRoute);
app.use('/api/mortgages', mortgageRoute);
app.use('/api/propertyscouting', scoutingRoute);
app.use('/api/events', eventRoute);
app.use('/api/save', saveRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
