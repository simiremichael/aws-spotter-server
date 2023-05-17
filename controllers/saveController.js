import mongoose from "mongoose";
import SaveProperty from "../models/savePropertyModel.js";
import Property from "../models/propertyModel.js";

export const saveProperty = async (req, res) => {
    
    const { category, title, _id, address1,  creator, bathroom, bedroom, buildingYear, companyAddress, 
        companyName, logo, companyId, slideImages, name, location, description, electricity, images, kitchen, lotSize, lga, livingRoom, serviceCharge,
        paymentType, postCode,  price, propertyGroup, propertyTax, propertyTitle, propertyType, showerRoom,
        size, state, street, taxes, tour, uniqNo, ultilities, video, id, water, yearRenovated, comfort,
        condition, hvac, parking, pets, security, longitude, latitude, phone, email, profilePicture} = req.body;

        //const existingSaveProperty = SaveProperty.findOne({id: _id});

       // if(existingSaveProperty) return res.status(404).json({ message: "Property already saved."})
 
    const newSavedProperty = new SaveProperty({ longitude, latitude, category, title, address1, profilePicture,
        location, description, electricity, images, kitchen, lotSize, lga, livingRoom, serviceCharge, slideImages,
        paymentType, postCode,  price, propertyGroup, propertyTax, propertyTitle, propertyType, showerRoom,
        size, state, street, taxes, tour, uniqNo, ultilities, video, water, yearRenovated, comfort,
        condition, hvac, parking, pets, companyId, security, creator, id: _id, createdAt: new Date().toLocaleString()})
  
     try {
     
        // if (!existingSaveProperty){
        //   await newSavedProperty.save();
        //   res.status(201).json(newSavedProperty);
          await SaveProperty.create( newSavedProperty);
          res.sendStatus(201);

        //  } else {
        //     await SaveProperty.findByIdAndRemove({id: _id});
        //     res.json({message: 'Property deleted successfully'});
        // }
          
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

    // try {
    //     const property = await Property.findOne(req.body);
    //     await SaveProperty.create({ property });
    //     res.sendStatus(201);
    //   } catch (err) {
    //     console.log(err);
    //     res.sendStatus(500);
    //   }
    
};

export const deleteSaveProperty = async (req, res) => {
               
     const {id} = req.params;
   

     try {
         await SaveProperty.deleteOne({id: id});
        //await Property.findByIdAndDelete(savedProperty.property);
        res.sendStatus(200);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
   
    //  try {
    //     const savedProperty = await SaveProperty.findByIdAndDelete(req.params.id);

    //    // await Property.findByIdAndDelete(savedProperty.newSavedProperty);
    //     res.sendStatus(200);
    //   } catch (err) {
    //     console.log(err);
    //     res.sendStatus(500);
    //   }
 
    //  await SaveProperty.findByIdAndRemove(id);
 
    //  res.json({message: 'Property deleted successfully'});
 
   };

   export const getSaveProperty = async (req, res) => {
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const {saveBy} = req.query
    
    const savedProperties = await SaveProperty.find({saveBy: saveBy});

    res.status(200).json({savedProperties});
};

