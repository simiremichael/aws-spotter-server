import mongoose from "mongoose";
import Event from "../models/eventModel.js";


export const getEvents = async (req, res) => {
    
     try {
         const allEvents = await Event.find().sort({createdAt: -1});
        
         res.status(200).json({data: allEvents });
     } catch (error) {
         res.status(404).json({message: error.message});
     }
 };

 export const getEvent = async (req, res) => { 

    const { id } = req.params;

    try {
        const event= await Event.findById(id);
        
        res.status(200).json({data: event});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAgentEvent = async (req, res) => {

     const { id } = req.params;
     console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Event doesn't exist" });
    }
    const agentEvent = await Event.find({ creator: id }).sort({createdAt: - 1}); 
    res.status(200).json({data: agentEvent});
  };

export const bookEvent = async (req, res) => {
    
    const { title, note, start, end  } = req.body;
   
    const newEvent = new Event({ title, note, start: start, end, creator: req.agentId,  createdAt: new Date().toLocaleString()})
    try {
        await newEvent.save();

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateEvent = async (req, res) => {
  
    const { id } = req.params;

    const {  title, note, start, end } = req.body;
        
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedEvent = { title, note, start, end, createdAt: new Date().toLocaleString()};

    await Event.findByIdAndUpdate(id, updatedEvent, { new: true });                    

    res.json(updatedEvent);

 }

export const deleteEvent = async (req, res) => {
                
     const {id} = req.params;
     if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');
 
     await Event.findByIdAndRemove(id);
 
     res.json({message: 'Post deleted successfully'});
 
   }

