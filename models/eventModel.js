import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema({
    id: String, 
    title: String,
    note: String,
    start: String, 
    end: String,
    createdAt: String,
    creator: String,
})

const Event = mongoose.model('Event', eventSchema);

export default Event;