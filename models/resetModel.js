import mongoose from 'mongoose';

const { Schema } = mongoose;

const resetSchema = new Schema({
    id: String, 
   email: String,
   password: String,
   otp: Number
})

const ResetOTP = mongoose.model('ResetOTP', resetSchema);

export default ResetOTP;

