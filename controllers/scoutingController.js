import mongoose from "mongoose";
import Scouting from "../models/scoutingModel.js";


export const getScoutings = async (req, res) => {
    
     try {
         const allScoutings = await Scouting.find().sort({createdAt: -1});
        
         res.status(200).json({data: allScoutings });
     } catch (error) {
         res.status(404).json({message: error.message});
     }
 };

 export const getScouting = async (req, res) => { 

    const { id } = req.params;

    try {
        const scouting = await Scouting.findById(id);
        
        res.status(200).json(scouting);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const propertyScouting = async (req, res) => {
    
    const { name, email, phone, location, category, propertyType, budget, description } = req.body;
   
    const newScouting = new Scouting({ name, email, phone, location, category, propertyType, budget, description, createdAt: new Date().toLocaleString()})
    try {
        await newScouting.save();

        res.status(201).json(newScouting);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateScouting = async (req, res) => {
  
    const { id } = req.params;

    const {  name, email, phone, location, category, propertyType, budget, description} = req.body;
        
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedScouting = { name, email, phone, location, category, propertyType, budget, description, createdAt: new Date().toLocaleString()};

    await Scouting.findByIdAndUpdate(id, updatedScouting, { new: true });                    

    res.json(updatedScouting);

 }

export const deleteScouting = async (req, res) => {
                
     const {id} = req.params;
     if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');
 
     await Scouting.findByIdAndRemove(id);
 
     res.json({message: 'Post deleted successfully'});
 
   }

