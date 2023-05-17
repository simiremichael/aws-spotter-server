import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoutingSchema = new Schema({
    id: String, 
    name: String,
    phone: String,
    email: String, 
    location: String,
    category: String,
    propertyType: String,
    budget: String,
    description: String,
    createdAt: String,
})

const Scouting = mongoose.model('Scouting', scoutingSchema);

export default Scouting;