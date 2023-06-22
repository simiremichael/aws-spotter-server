import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Agent from '../models/agentModel.js';
import mongoose from "mongoose";
import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';
import { S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import crypto from 'crypto';
import sharp from 'sharp';

dotenv.config();

const bucketName = process.env.AGENT_BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.AGENT_ACCESS_KEY
const secreteAccessKey = process.env.AGENT_SECRETE_ACCESS_KEY

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({ 
  credentials: {
    accessKeyId: accessKey,
  secretAccessKey: secreteAccessKey,
  },
  region: bucketRegion, 
});


export const signin = async (req, res) => {
  
    const {email, password} = req.body; 
    try{
        const existingAgent = await Agent.findOne({email: email.toLowerCase()});
        if(!existingAgent) return res.status(404).json({ message: "Agent not found"});
       
        const isPasswordCorrect = await bcrypt.compare(password, existingAgent.password);
        if(!isPasswordCorrect ) return res.status(404).json({ message: "Invalid password"});
      
        
        const agentToken = jwt.sign({ phone: existingAgent.phone, profilePicture: existingAgent.profilePicture, name: existingAgent.name, logo: existingAgent.logo, companyName: existingAgent.companyName, companyId: existingAgent.companyId, address: existingAgent.address, email: existingAgent.email, id: existingAgent._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '3m' });
        const refreshToken = jwt.sign({phone: existingAgent.phone, profilePicture: existingAgent.profilePicture, name: existingAgent.name, logo: existingAgent.logo, companyName: existingAgent.companyName, companyId: existingAgent.companyId, address: existingAgent.address, email: existingAgent.email, id: existingAgent._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '7d' });
   
        res.cookie(process.env.REACT_APP_AGENT_COOKIE_KEY, refreshToken, 
        { httpOnly: true, secure: true, sameSite: 'None', 
        maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ result: existingAgent, agentToken });
    } catch(error) {
    res.status(500).json({ message: "Something went wrong."});
    console.log(error);
}
};

export const getAgents = async (req, res) => {
    const {page} = req.query;
 try {
    //  const LIMIT = 8;
    //  const startIndex =(Number(page) - 1) * LIMIT;
    //  const total = await Agent.countDocuments({});

     const agents = await Agent.find()
     //.sort({_id: -1}).limit(LIMIT).skip(startIndex);
    
     res.status(200).json({data: agents });
     //, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)
 } catch (error) {
     res.status(404).json({message: error.message});
 }
}

export const getAgent = async (req, res) => { 
   // res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { id } = req.params;

    try {
        const agent = await Agent.findById(id);
        
        res.status(200).json(agent);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getAgentCompany = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Agent doesn't exist" });
    }
   
    const agentCompany = await Agent.find({ company: id });
    res.status(200).json(agentCompany);
  };

export const refresh = async (req, res) => {
   // res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
   
    // const {email, password} = req.body; 

    const cookies = req.cookies;
    if (!cookies?.Residencespotterjwa) return res.sendStatus(401);
    const refreshToken = cookies.Residencespotterjwa;                              
    // evaluate jwt  
    jwt.verify(
        refreshToken,
        process.env.REACT_APP_TOKEN_KEY,
        async (err, decoded) => {
            if (err) return res.status(403).json({message: 'forbidden'});
            const foundAgent = await Agent.findOne({email: decoded.email});
            if (!foundAgent) return res.status(401).json({message: 'unauthorized'});

            const agentToken= jwt.sign({ phone: foundAgent.phone, profilePicture: foundAgent.profilePicture, name: foundAgent.name, logo: foundAgent.logo, companyName: foundAgent.companyName, companyId: foundAgent.companyId, address: foundAgent.address, email: foundAgent.email, id: foundAgent._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '7d' });
            
            res.status(200).json({agentToken})
        })
        }       

       export const logout = (req, res) => {
        const cookies = req.cookies;
        if (!cookies.Residencespotterjwa) return res.status(204)
        res.clearCookie(process.env.REACT_APP_AGENT_COOKIE_KEY, { httpOnly: true, sameSite: 'None', secure: true });
       res.json({message: 'cookie cleared'});
    }

    export const awsUpload =  async (req, res) => {
        const {buffer, originalname, mimetype} = req.file;
          
         //const uploadedTime = new Date().getTime().toLocaleString();
         //const buffers = await sharp(buffer).resize({height:1920,width: 1080, fit: "contain"}).toBuffer();
         const buffers = await sharp(buffer).resize({height: 360,width: 360, fit: "fill"}).toBuffer();
         const imageName = randomImageName()
           const params = {
             Bucket: bucketName,
             Key: imageName,
             //uploadedTime+originalname,
             Body: buffers,
             ContentType: mimetype,
           }
          // const results = await s3.send(new PutObjectCommand(params));
          //  const getObjectParams = {
          //    Bucket: bucketName,
          //    Key: imageName,
          //  }
            
           const comand = new PutObjectCommand(params);
            await s3.send(comand);
         
           res.json({url: `https://rs-agent-picture.s3.af-south-1.amazonaws.com/${imageName}`})
         
        //    const command = new GetObjectCommand(getObjectParams);
        //  //const url = await getSignedUrl( s3, command, { expiresIn: 3600 });
        //   res.status(201).json({url: command});
           }

export const signup = async (req, res) => {
   // res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const {role, email, password, profilePicture,companyName, logo, address, companyId, confirmPassword, id, state, location, company, firstName, lastName, phone} = req.body;
    try {
        const existingAgent = await Agent.findOne({email});
    if(existingAgent) return res.status(400).json({ message: "Agent already exists"})

    if(password !== confirmPassword) return res.status(400).json({ message: "Password does not match"})

    const hashedPassword = await bcrypt.hash(password, 12);


    if (profilePicture === '') return res.status(403).json({message: 'Profile picture is required'})
    if (state === '') return res.status(403).json({message: 'State is required'})
    if ( location === '') return res.status(403).json({message: 'Area is required'})
    if (phone === '') return res.status(403).json({message: 'Phone is required'})

    const result = await Agent.create({ role, address: req.companyAddress, companyId: req.companyId, companyName: req.companyName, logo: req.companyLogo, email, state, location, profilePicture, company: req.companyId, password: hashedPassword, name: `${firstName} ${lastName}`, phone, createdAt: new Date().toLocaleString() })

    // const token = jwt.sign({email: result.email, id: result.id}, 'test', { expiresIn: '1h' });
   
    res.status(200).json(result);
   
} catch (error) {
    res.status(500).json({ message: "Something went wrong."});
    }
}


export const updateAgent = async (req, res) => {
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { id } = req.params;

    const { role, email, password, profilePicture, confirmPassword, state, location, company, name, phone} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedAgent = {role,  email, state, location, profilePicture, companyId: req.companyId, password: hashedPassword, name, phone, createdAt: new Date().toLocaleString() };

    await Agent.findByIdAndUpdate(id, updatedAgent, { new: true });                    

    res.json(updatedAgent);

 }

 export const deleteAgent = async (req, res) => {
  
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');

    await Agent.findByIdAndRemove(id);

    res.send({message: 'Post deleted successfully'});

  };

  export const generateAgentOTP = async (req, res) => {

    const otp =  otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
 
     const {email} = req.body;
 
     try{
 
     const existingAgent = await Agent.findOne({email: email.toLowerCase()})
 
     const id = existingAgent._id
 
     if (existingAgent) {
       const send_to =  email && process.env.EMAIL_USER;
       const send_from = process.env.EMAIL_USER;
       const subject = 'Password Reset OTP';
       const message = `   
       <h3>Residence Spotter User Password Reset.</h3>
       <p>Your OTP for password reset is: <strong>${otp}</strong></p>
       `
       await sendEmail(subject, message, send_to, send_from);
 
      const generatedOTP = { otp: otp,}
 
       await Agent.findByIdAndUpdate(id, generatedOTP, { new: true });  
 
      res.status(201).json({generatedOTP});
      return res.status(201).send({ message: "OTP sent successfully"})
     }
     if(!existingAgent) return res.status(404).send({ message: "Invalid Email"})
 
   } catch (error) {
     return res.status(500).send({ message: 'failed to create OTP'});
    }
 
 };
 
 
   export const resetAgentPassword = async (req, res) => {
 
     const {email, password, confirmPassword, otp} =req.body;
 
  try{
  const existingAgent = await Agent.findOne({email: email.toLowerCase(), otp: otp});
 
  const id = existingAgent._id
  
  if(!existingAgent) return res.status(404).json({ message: "User does not exist"})
 
      if(password !== confirmPassword) return res.status(400).json({ message: "Password does not match"})
  if ( existingAgent.otp === otp ) {
 
     const hashedPassword = await bcrypt.hash(password, 12);
 
  const updatedPassword = { otp: null, password: hashedPassword }
 
      await Agent.findByIdAndUpdate(id, updatedPassword, { new: true })
 
      res.status(201).json({updatedPassword});
 
      return res.status(201).send({ message: 'Password reset successfully'})
  } else {
   return res.status(404).send({message: 'Ivalid OTP'});
  }
 
  } catch (err) {
   return res.status(500).send({ message: 'Password reset failed'});
  }
   }