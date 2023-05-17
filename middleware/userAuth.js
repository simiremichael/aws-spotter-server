import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const userAuth = async (req, res, next) => {

    const authHeader = req.headers.userAuthorization || req.headers.userauthorization


    if (!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized'})
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.REACT_APP_TOKEN_KEY,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            if (token){
            req.email = decoded?.email;
            req.userId = decoded?.id;
            } else {
                decodedData = jwt.decode(token);
           req.userId = decodedData?.sub;
            const googleId = decodedData?.sub.toString();
         const user = await User.findOne({ googleId });
         req.userId = user?._id;
            }
            next()
        })

    // jwt.verify(
    //     token,
    //     process.env.REACT_APP_TOKEN_KEY,
    //    async (err, decoded) => {
    //         if (err) return res.status(403).json({ message: 'Forbidden' })
    //         if (token){
    //         req.email = decoded?.email;
    //         req.userId = decoded?.id;
    //         } else {
    //         decodedData = jwt.decode(token);
    //        req.userId = decodedData?.sub;
    //         const googleId = decodedData?.sub.toString();
    //      const user = await User.findOne({ googleId });
    //      req.userId = user?._id;
    //         }
    //         next()
    //        // console.log(decoded);
    //     }
    // )
    // try {
    //     const token = req.headers.authorization.split(" ")[1];
    //     const isCustomAuth = token.length < 500;

    //     let decodedData;

    //     if(token && isCustomAuth) {
    //         decodedData = jwt.verify(token, 'test');
    //         req.userId = decodedData?.id;
    //     } else {
    //          decodedData = jwt.decode(token);
    //         req.agentId = decodedData?.sub;
    //         const googleId = decodedData?.sub.toString();
    //   const user = await User.findOne({ googleId });
    //   req.userId = user?._id;
    //     }
    //     next();

    // } catch (error) {
    //     console.log(error);
    // }
}

export default userAuth;

