import mongoose from 'mongoose';

const { Schema } = mongoose;

const agentSchema = new Schema({
    id: String, 
    // _id: new mongoose.Types.ObjectId(),
    role:  String,
    name: String,
    phone: String,
    companyName: String,
    logo: String,
    address: String,
    email: String, 
    password: String, 
    profilePicture: String,
    state: String, 
    location: String,
    company: String,
     token: String,
    //  property: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    //  company: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
    createdAt: String,
    refreshToken: [String],
    agentToken: String,
    expiredAt: String,
    companyId: String,
    otp: String
})

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;