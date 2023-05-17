import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const agentAuth = async (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const agentToken = authHeader.split(' ')[1]
      
    jwt.verify(
        agentToken,
        process.env.REACT_APP_TOKEN_KEY,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.email = decoded.email;
            req.agentId = decoded?.id;
            req.companyAddress = decoded?.address;
            req.companyName = decoded?.companyName; 
            req.companyLogo = decoded?.logo;
            req.companyId = decoded?.companyId;
            req.name = decoded?.name;
            req.profilePicture = decoded?.profilePicture;
            req.phone = decoded?.phone;
            next()
            // console.log(decoded);
        }
    )
    
        

//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         const isCustomAuth = token.length < 500;
//      console.log(token)
        
//      let decodedData;
// //
//         if(token && isCustomAuth) {
//             decodedData = jwt.verify(token, 'test');
//             req.agentId = decodedData?._id;
//         } else {
//             // decodedData = jwt.decode(token);
//             // req.agentId = decodedData?.sub;
//             // const googleId = decodedData?.sub.toString();
//     //   const user = await UserModel.findOne({ googleId });
//     //   req.userId = user?._id;
//         }
//         next();

//     } catch (error) {
//         console.log(error);
    

}

export default agentAuth