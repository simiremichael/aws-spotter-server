import mongoose from 'mongoose';

const { Schema } = mongoose;

const mortgageSchema = new Schema({
    id: String, 
    name: String, 
    email: String, 
    phone: Number,
    mortgageType: String, 
    stage: String, 
    when: String,  
    typeOfProperty: String,  
    propertyStatus: String,  
    propertyvalue: Number,
    downPaymentPercent: Number, 
    downpayment: String,  
    loanamountnumber: String,  
    loanTermmonths: Number,
    monthlypayment: String, 
    totalLoanpayable: String, 
    chips: [],
    appliedBy: String,
    createdAt: String,
})

const Mortgage = mongoose.model('Mortgage', mortgageSchema);

export default Mortgage;
