import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    role:  String,
    name: {type: String},
    phone: Number,
    email: {type: String},
    password: String,
    id: { type: String }, 
    name1: {type: String},
    picture: String,
    role: String,
    googleId: String,
    otp: String,
    createdAt: String
})

const User = mongoose.model('User', userSchema);

export default User;