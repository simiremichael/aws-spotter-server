import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import sendEmail from '../utils/sendEmail.js';
import otpGenerator from 'otp-generator';

dotenv.config();

export const signin = async (req, res) => {
  //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
const {email, password} = req.body;
try{
    const existingUser = await User.findOne({email: email.toLowerCase()});
    if(!existingUser) return res.status(404).json({ message: "User doesn't exist"})
   
    const isPasswordCorrect = bcrypt.compare(password, existingUser.password);
    if(!isPasswordCorrect ) return res.status(404).json({ message: "Invalid credentials."});
    
    const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '3m' });
    const refreshToken = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '7d' });

    res.cookie(process.env.REACT_APP_USER_COOKIE_KEY, refreshToken, 
    { httpOnly: true, secure: true, sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ result: existingUser, token});
} catch(error) {
res.status(500).json({ message: "Something went wrong."});
console.log(error);
}
}
// process.env.REACT_APP_TOKEN_KEY
export const refresh = async (req, res) => {
  //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const cookies = req.cookies;
    if (!cookies?.jws) return res.status(401).json({message: 'Unauthorized'});
    const refreshToken = cookies.jws;                                
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REACT_APP_TOKEN_KEY,
        async (err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden'});
            const foundUser = await User.findOne({email: decoded.email});
            if (!foundUser) return res.status(401).json({message: 'Unauthorized'});
            
            const token = jwt.sign({ email: foundUser.email, id: foundUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '7d' });
            res.json({token})
        })
    }

    export const logout = (req, res) => {
        const cookies = req.cookies;
        if (!cookies.jws) return res.status(204);
        res.clearCookie(process.env.REACT_APP_USER_COOKIE_KEY, { httpOnly: true, sameSite: 'None', secure: true });
       res.json({message: 'cookie cleared'});
    }

export const signup = async (req, res) => {
 // res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { email, password, role, confirmPassword, picture, family_name, given_name, firstName, lastName, phone} = req.body;

    try {
        const existingUser = await User.findOne({email: email.toLowerCase()});
    if(existingUser) return res.status(400).json({ message: "User already exists"})

     if(password !== confirmPassword) return res.status(400).json({ message: "Password does not match"})

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({ email: email.toLowerCase(), password: hashedPassword, role, picture, name1: `${family_name} ${given_name}`, name: `${firstName} ${lastName}`, phone, createdAt: new Date().toISOString()})

    // const token = jwt.sign({email: result.email, id: result._id}, 'test', { expiresIn: '1h' });

    res.status(200).json({ result, token });
    } catch (error) {
    res.status(500).json({ message: "Something went wrong."});
    }
}

export const googleSignIn = async (req, res) => {
  //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { picture, email, family_name, given_name, token, googleId } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // const result = { existingUser };
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '7d' });
      res.cookie(process.env.REACT_APP_USER_COOKIE_KEY, refreshToken, 
    { httpOnly: true, secure: true, sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ result: existingUser, token });
      } else {
      const result = await User.create({
        email,
        name:`${family_name} ${given_name}`,
        googleId,
        picture
      });
      const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '1h' });
      const refreshToken = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.REACT_APP_TOKEN_KEY, { expiresIn: '7d' });
    res.cookie(process.env.REACT_APP_USER_COOKIE_KEY, refreshToken, 
    { httpOnly: true, secure: true, sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(200).json({ result, token });
    }
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  export const updateUser = async (req, res) => {
    const { id } = req.params;

    const {  email, password, role, confirmPassword, picture, family_name, given_name, firstName, lastName, phone} = req.body;
    
    if(password !== confirmPassword) return res.status(400).json({ message: "Password does not match"})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = {email: email.toLowerCase(), password: hashedPassword, role, picture, name1: `${family_name} ${given_name}`, name: `${firstName} ${lastName}`, phone, createdAt: new Date().toISOString()};

    await User.findByIdAndUpdate(id, updatedUser, { new: true });                    

    res.json(updatedUser);

  };

  export const generateOTP = async (req, res) => {

   const otp =  otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    const {email} = req.body;

    try{

    const existingUser = await User.findOne({email: email.toLowerCase()})

    const id = existingUser._id

    if (existingUser) {
      const send_to =  email;
      const send_from = process.env.EMAIL_USER;
      const subject = 'Password Reset OTP';
      const message = `   
      <h3>Residence Spotter User Password Reset.</h3>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      `

      await sendEmail(subject, message, send_to, send_from);

     const generatedOTP = { otp: otp,}

      await User.findByIdAndUpdate(id, generatedOTP, { new: true });  

     res.status(201).json({generatedOTP});
     return res.status(201).json({ message: "OTP sent successfully"})
    }
    if(!existingUser) return res.status(404).json({ message: "Invalid Email"})

  } catch (error) {
    return res.status(500).send({ message: 'failed to create OTP'});
   }

};


  export const resetPassword = async (req, res) => {

    const {email, password, confirmPassword, otp} =req.body;

 try{
 const existingUser = await User.findOne({email: email.toLowerCase(), otp: otp});

 const id = existingUser._id
 
 if(!existingUser) return res.status(404).json({ message: "User does not exist"})

     if(password !== confirmPassword) return res.status(400).json({ message: "Password does not match"})
 if ( existingUser.otp === otp) {

    const hashedPassword = await bcrypt.hash(password, 12);

 const updatedPassword = { otp: null, password: hashedPassword }

     await User.findByIdAndUpdate(id, updatedPassword, { new: true })

     res.status(201).json({updatedPassword});

     return res.status(201).send({ message: 'Password reset successfully'})
 } else {
  return res.status(404).send({message: 'Ivalid OTP'});
 }

 } catch (err) {
  return res.status(500).send({ message: 'Password reset failed'});
 }
  }

  export const deleteUser = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no user with that id');

    await User.findByIdAndRemove(id);

   return res.status(201).send({message: 'User deleted successfully'});
  }