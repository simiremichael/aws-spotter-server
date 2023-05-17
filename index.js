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
  'https://my-property-finder.vercel.app', 'https://www.residencespotter.com']
}))
// allowedHeaders: '*',
// allowedMethods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
// // optionsSuccessStatus:200,
// //  httpStatusCode: 200
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://my-property-finder.vercel.app');
//   res.header("Access-Control-Allow-Credentials", true );
//   res.header("Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE");
//   next();
// });

// app.use( async(req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://my-property-finder.vercel.app");
//   res.header("Access-Control-Allow-Headers", "https://my-property-finder.vercel.app")
//   res.header("Access-Control-Allow-Credentials", true );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//     next();
// }) 

app.use('/properties', propertyRoute);
app.use('/users', userRoute);
app.use('/companies', companyRoute);
app.use('/agents', agentRoute);
app.use('/mortgages', mortgageRoute);
app.use('/propertyscouting', scoutingRoute);
app.use('/events', eventRoute);
app.use('/save', saveRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
