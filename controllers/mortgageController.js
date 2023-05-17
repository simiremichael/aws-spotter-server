import mongoose from "mongoose";
import express from 'express';
import Mortgage from "../models/mortgageModel.js";


export const getMortgages = async (req, res) => {
        const {page} = req.query;
     try {
         const LIMIT = 15;
         const startIndex =(Number(page) - 1) * LIMIT;
         const total = await Mortgage.countDocuments({});
 
         const mortgages = await Property.find().sort({createdAt: -1}).limit(LIMIT).skip(startIndex);
        
         res.status(200).json({data: mortgages, currentPage: (Number(page)), numberOfPages: Math.ceil(total / LIMIT) });
     } catch (error) {
         res.status(404).json({message: error.message});
     }
 };

 export const getMortgage = async (req, res) => { 

    const { id } = req.params;

    try {
        const mortgage = await Mortgage.findById(id);
        
        res.status(200).json(mortgage);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const apply = async (req, res) => {
    
    const { name, email, phone, mortgageType, stage, when, typeOfProperty, propertyStatus, propertyvalue, 
        downPaymentPercent, downpayment, loanamount, loanTermmonths, monthlypayment, totalLoanpayable, chips} = req.body;
   
    const newMortgage = new Mortgage({ name, email, phone, mortgageType, stage, when, typeOfProperty, propertyStatus, propertyvalue, 
        downPaymentPercent, downpayment, loanamount, loanTermmonths, monthlypayment, totalLoanpayable, chips, appliedBy: req.userId, createdAt: new Date().toLocaleString()})
    try {
        await newMortgage.save();

        res.status(201).json(newMortgage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const deleteMortgage = async (req, res) => {
                
     const {id} = req.params;
     if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');
 
     await Mortgage.findByIdAndRemove(id);
 
     res.json({message: 'Post deleted successfully'});
 
   }

