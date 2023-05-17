import mongoose from "mongoose";
import express from 'express';
import Property from "../models/propertyModel.js";
import NodeGeocoder  from 'node-geocoder';

const router = express.Router();

export const getProperties = async (req, res) => {
   // res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
       const {page} = req.query;
    try {
        const LIMIT = 15;
        const startIndex =(Number(page) - 1) * LIMIT;
        const total = await Property.countDocuments({});

        const properties = await Property.find().sort({createdAt: -1}).limit(LIMIT).skip(startIndex);
       
        res.status(200).json({data: properties, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


// export const getPropertyBySearch = async (req, res) => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
//   const search = new RegExp(req.query.search, 'i');
//   //const search  = req.params;
//    console.log(search);

//   //if(req.params.location) {
//    if(search !== '') {
//     try {
//         // const data = await Property.find({location: { $regex: req.params.location, $options: 'i'}});
//         const data = await Property.find({location: search, });
//         res.status(200).json({data});
//     } catch (error) {
//         res.status(404).json({ message: 'Property not found'})
//     } 
// }else {
//     res.status(404).json({ message: 'queryLocation not found'})
//    }
// }


export const getPropertyBySearch = async (req, res) => {

   const { search, toggle, type, minPrice, maxPrice, duration, selectBath, selectBed, page} = req.query;
  const searchResult = new RegExp(search, 'i');

    try {
        const LIMIT = 15;
        const startIndex =(Number(page) -1) * LIMIT;
        const total = await Property.countDocuments({});

        const query = {};
        if (minPrice !== '' ) {
       query.price = { $gte: minPrice };
       }
        if (maxPrice !== '') {
        query.price = { ...query.price, $lte: maxPrice };
         }
      if (type !== '') {
       query.propertyType =  type;
       }
       if (search !== '') {
           query.$or  = [
            {location: searchResult},
            {buildingName: searchResult},
            {estateName: searchResult},
            {state: searchResult},
            ]
          }
          if (toggle !== '') {
              query.category =  toggle;
          }
          if (selectBed !== '') {
              query.bedroom = selectBed;
          }
          if (selectBath !== '') {
              query.bathroom =  selectBath;
          }
          if (duration !== '') {
            query.paymentType =  duration;
        }

        const data = await Property.find(query).sort({createdAt: -1}).limit(LIMIT).skip(startIndex);
        res.json({ data, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT),total });
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const getPropertyBySearchByBuy = async (req, res) => {
    //res.set("Access-Control-Allow-Origin", "*");

    const { searchParams, search, category, sort, bed, bath, minPrice, maxPrice, type, page} = req.query;
    // const search = searchParams.search
    // const datas = await Property.find();
//    const priceData = datas.map((i) => i.price )
//    const priceDatas = priceData.filter(i => i >= minPrice && i <=maxPrice);
   const searchResult = new RegExp(search, 'i');
    
     try {
         const LIMIT = 15;
         const startIndex =(Number(page) - 1) * LIMIT;
         const total = await Property.countDocuments({category});
         const query = {};
          if (minPrice !== '' ) {
         query.price = { $gte: minPrice };
         }
          if (maxPrice !== '') {
          query.price = { ...query.price, $lte: maxPrice };
           }
        if (type !== '') {
         query.propertyType =  type;
         }
         if (search !== '') {
            query.$or  = [
                {location: searchResult},
                {buildingName: searchResult},
                {estateName: searchResult},
                {state: searchResult},
             ]
            }
            if (category !== '') {
                query.category =  category;
            }
            if (bed !== '') {
                query.bedroom = bed;
            }
            if (bath !== '') {
                query.bathroom =  bath;
            }

         let sortBy = {} || {createdAt: -1}
         if (sort === 'featured:desc') {
            sortBy = {featured: -1}
         } else if (sort === 'price:desc') {
            sortBy = {price: 1}
         } else if (sort === 'price:inc') {
            sortBy = {price: -1}
         } else if (sort === 'bed:desc') {
            sortBy = {bed: 1}
         } else if (sort === 'bed:inc') {
            sortBy = {bed: -1}
         } else if (sort === 'build:inc') {
            sortBy = {buildingYear: -1}
         } else {
            sortBy = {buildingYear: 1}
         }
         const data = await Property.find(query).sort(sortBy).limit(LIMIT).skip(startIndex);
         res.json({ data, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT), total });
        
     } catch (error) {
         res.status(404).json({ message: error.message})
     }
 }
 export const getPropertyBySearchByRent = async (req, res) => {
   
    const { searchParams, search, category, sort, bed, bath, minPrice, maxPrice, type, page} = req.query;
   
    const datas = await Property.find();
//    const priceData = datas.map((i) => i.price )
//    const priceDatas = priceData.filter(i => i >= minPrice && i <=maxPrice);
   const searchResult = new RegExp(search, 'i');
    //console.log(searchResult, priceDatas, priceData, bed, bath);
     try {
         const LIMIT = 15;
         const startIndex =(Number(page) - 1) * LIMIT;
         const total = await Property.countDocuments({category});
         const query = {};
         if (minPrice !== '' ) {
        query.price = { $gte: minPrice };
        }
         if (maxPrice !== '') {
         query.price = { ...query.price, $lte: maxPrice };
          }
       if (type !== '') {
        query.propertyType =  type;
        }
        if (search !== '') {
            query.$or  = [
                {location: searchResult},
                {buildingName: searchResult},
                {estateName: searchResult},
                {state: searchResult},
             ]
           }
           if (category !== '') {
               query.category =  category;
           }
           if (bed !== '') {
               query.bedroom = bed;
           }
           if (bath !== '') {
               query.bathroom =  bath;
           }

         let sortBy = {} || {createdAt: -1}
         if (sort === 'featured:desc') {
            sortBy = {featured: -1}
         } else if (sort === 'price:desc') {
            sortBy = {price: 1}
         } else if (sort === 'price:inc') {
            sortBy = {price: -1}
         } else if (sort === 'bed:desc') {
            sortBy = {bed: 1}
        } else if (sort === 'bed:inc') {
            sortBy = {bed: -1}
         } else if (sort === 'build:inc') {
            sortBy = {buildingYear: -1}
         } else {
            sortBy = {buildingYear: 1}
         }
                       
         const data = await Property.find(query).sort(sortBy).limit(LIMIT).skip(startIndex);
         res.json({ data, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT),total });
     } catch (error) {
         res.status(404).json({ message: error.message})
     }
 }
 export const getPropertyByNativeSearch = async (req, res) => {

    const { search, paymentType, bedroom, propertyType, bathroom, minprice, maxprice, minSize, maxSize, toggle, propertyGroup, sort} = req.query;
   const searchResult = new RegExp(search, 'i');
   const datas = await Property.find();
    const priceData = datas.map((i) => i.price )
    const priceDatas = priceData.filter(i => i >= minprice && i <=maxprice);
    const sizeData = datas.map((i) => i.size )
    const sizeDatas = sizeData.filter(i => i >= minSize && i <=maxSize);
    let sortBy = {} || {createdAt: -1}
    if (sort === 'featured') {
       sortBy = {featured: -1}
    } else if (sort === 'minPrice') {
       sortBy = {price: 1}
    } else if (sort === 'maxPrice') {
       sortBy = {price: -1}
    } else  {
       sortBy = {createdAt: -1}
   } 
     try {
         const data = await Property.find({location: searchResult, price: priceDatas, size: sizeDatas, propertyType: propertyType, propertyGroup: propertyGroup, paymentType: paymentType, bedroom: bedroom, bathroom: bathroom, category: toggle }).sort(sortBy);
         res.json({ data });
     } catch (error) {
         res.status(404).json({ message: error.message})
     }
 }

export const getProperty = async (req, res) => { 
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { id } = req.params;

    try {
        const property = await Property.findById(id);
        
        res.status(200).json(property);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const moreProperty = async (req, res) => {
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { location, price, propertyType, bedroom, category } = req.query;
     try {
         const data = await Property.find({location: location, propertyType: propertyType, price: price, bedroom: bedroom, category: category});
         res.json(data);
     } catch (error) {
         res.status(404).json({ message: error.message})
     }
 }
             
export const getPropertyByAgent = async (req, res) => {
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
   const {page} = req.query;
     const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Agent doesn't exist" });
    }
    const LIMIT = 15;
    const startIndex = (Number(page) -1) * LIMIT;
    const total = await Property.countDocuments({creator: id});
    const agentProperties = await Property.find({ creator: id }).sort({createdAt: - 1}).limit(LIMIT).skip(startIndex);
    res.status(200).json({agentProperties, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
  };
  export const getNativePropertyByAgent = async (req, res) => {
    
      const { id } = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(404).json({ message: "Agent doesn't exist" });
     }
     const agentProperties = await Property.find({ creator: id }).sort({createdAt: - 1});
     res.status(200).json(agentProperties);
    }

  export const companyPropertySearch = async (req, res) => {
  
    const {searchQuery,  page} = req.query
    const { id, search } = req.params;
    const searchResult =   new RegExp(searchQuery, 'i');

    const LIMIT = 15;
    const startIndex = (Number(page) -1 ) * LIMIT;
    const total = await Property.countDocuments({companyId: id}); 
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Agent doesn't exist" });
    }
    const companyProperties = await Property.find({companyId: id, location: searchResult}).sort({createdAt: - 1}).limit(LIMIT).skip(startIndex);
    res.status(200).json({companyProperties, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
};

export const commercial = async (req, res) => {
  
    const { searchParams, search, propertyGroup, category, sort, bed, bath, minPrice, maxPrice, type, page} = req.query;
  
   const searchResult = new RegExp(search, 'i');
  
     try {
         const LIMIT = 15;
         const startIndex =(Number(page) -1) * LIMIT;
         const total = await Property.countDocuments({propertyGroup});
         const query = {};
         if (minPrice !== '' ) {
        query.price = { $gte: minPrice };
        }
         if (maxPrice !== '') {
         query.price = { ...query.price, $lte: maxPrice };
          }
       if (type !== '') {
        query.propertyType =  type;
        }
        if (propertyGroup !== '') {
         query.propertyGroup = propertyGroup;
        }
        if (search !== '') {
           query.$or = [
            {location: searchResult},
            {buildingName: searchResult},
            {estateName: searchResult},
            {state: searchResult},
           ];
           }
           if (category !== '') {
               query.category =  category;
           }
           if (bed !== '') {
               query.bedroom = bed;
           }
           if (bath !== '') {
               query.bathroom =  bath;
           }

         let sortBy = {} || {createdAt: -1}
         if (sort === 'featured:desc') {
            sortBy = {featured: -1}
         } else if (sort === 'price:desc') {
            sortBy = {price: 1}
         } else if (sort === 'price:inc') {
            sortBy = {price: -1}
         } else if (sort === 'bed:desc') {
            sortBy = {bed: 1}
        } else if (sort === 'bed:inc') {
            sortBy = {bed: -1}
         } else if (sort === 'build:inc') {
            sortBy = {buildingYear: -1}
         } else {
            sortBy = {buildingYear: 1}
         }
         const data = await Property.find(query).sort(sortBy).limit(LIMIT).skip(startIndex);
         res.json({ data, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT),total });
     } catch (error) {
         res.status(404).json({ message: error.message})
     }
 }

export const newProject = async (req, res) => {

    const { searchParams, search, possession, sort, maxBed, minBed, minPrice, maxPrice, type, propertyGroup, page} = req.query;

   const searchResult = new RegExp(search, 'i');
 
     try {
         const LIMIT = 15;
         const startIndex =(Number(page) - 1) * LIMIT;
         const total = await Property.countDocuments({propertyGroup});

         const query = {};
         if (minPrice !== '' ) {
        query.price = { $gte: minPrice };
        }
         if (maxPrice !== '') {
         query.price = { ...query.price, $lte: maxPrice };
          }
       if (type !== '') {
        query.propertyType =  type;
        }
        if (search !== '') {
            query.$or  = [
                {location: searchResult},
                {buildingName: searchResult},
                {estateName: searchResult},
                {state: searchResult},
             ]
           }
           if (minBed !== '') {
               query.bedroom = {$gte: minBed};
           }
           if (maxBed !== '') {
               query.bedroom =  { ...query.bedroom, $lte: maxBed};
           }
           if (propertyGroup !== '') {
             query.propertyGroup =  propertyGroup;
         }
         if (possession !== '') {
           query.possession = possession;
         }

         const data = await Property.find(query).sort({createdAt: -1}).limit(LIMIT).skip(startIndex);
         res.json({ data, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT), total });
       
     } catch (error) {
         res.status(404).json({ message: error.message})
     }
}

export const offplan = async (req, res) => {
   
    const { searchParams, search, possession, sort, maxBed, minBed, minPrice, maxPrice, type, propertyGroup, page} = req.query;

    // const datas = await Property.find();
    // const priceData = datas.map((i) => i.price )
    // const priceDatas = priceData.filter(i => i >= minPrice && i <=maxPrice);
    // const bedData = datas.map((b) => b.bedroom)
    // const bedDatas = bedData.filter(b => b >= minBed && b <= maxBed)
    const searchResult = new RegExp(search, 'i');
  
      try {
          const LIMIT = 15;
          const startIndex =(Number(page) - 1) * LIMIT;
          const total = await Property.countDocuments({propertyGroup});
          const query = {};
          if (minPrice !== '' ) {
         query.price = { $gte: minPrice };
         }
          if (maxPrice !== '') {
          query.price = { ...query.price, $lte: maxPrice };
           }
        if (type !== '') {
         query.propertyType =  type;
         }
         if (search !== '') {
             query.$or  = [
                {location: searchResult},
                {buildingName: searchResult},
                {estateName: searchResult},
                {state: searchResult},
              ]
            }
            if (minBed !== '') {
                query.bedroom = {$gte: minBed};
            }
            if (maxBed !== '') {
                query.bedroom =  { ...query.bedroom, $lte: maxBed};
            }
            if (propertyGroup !== '') {
              query.propertyGroup =  propertyGroup;
          }
          if (possession !== '') {
            query.possession = possession;
          }
 
          const data = await Property.find(query).sort({createdAt: -1}).limit(LIMIT).skip(startIndex);
         res.json({ data, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT), total });
         //  console.log(propertyGroup, searchResult, priceDatas,  bedDatas,  possession, type)
      } catch (error) {
          res.status(404).json({ message: error.message})
      }
}


export const createProperty = async (req, res) => {
    
    const { category, title, address, estateName, buildingName, developer, creator, bathroom, bedroom, buildingYear, companyAddress, 
        companyName, logo, location, description, electricity, images, kitchen, lotSize, lga, livingRoom, serviceCharge,
        paymentType, postCode,  price, propertyGroup, propertyTax, propertyTitle, propertyType, showerRoom,
        size, state, street, taxes, tour, uniqNo, ultilities, video, id, water, yearRenovated, comfort,
        condition, hvac, parking, pets, security, slideImages, phone, email} = req.body;
    //  const property = req.body;
    const options = {
        provider: 'google',
      
        // Optional depending on the providers
        //fetch: customFetchImplementation,
        apiKey: process.env.LOCATION_KEY, // for Mapquest, OpenCage, Google Premier
        formatter: null // 'gpx', 'string', ...
      };
      const geocoder = NodeGeocoder(options);
      const response = await geocoder.geocode(address);
      const longitude = Number(response.map(long => long.longitude));
      const latitude = Number(response.map(lat => lat.latitude));

    const newProperty = new Property({ longitude, latitude, category, title, address, estateName, buildingName, developer, bedroom,  bathroom, buildingYear,
        name: req.name, profilePicture: req.profilePicture, phone: req.phone, email: req.email,
        logo: req.companyLogo, companyAddress: req.companyAddress, companyName: req.companyName,
        location, description, electricity, images, kitchen, lotSize, lga, livingRoom, serviceCharge,
        paymentType, postCode,  price, propertyGroup, propertyTax, propertyTitle, propertyType, showerRoom,
        size, state, street, taxes, tour, uniqNo, ultilities, video, water, yearRenovated, comfort,
        condition, hvac, parking, pets, companyId: req.companyId, security, creator: req.agentId, id,slideImages, createdAt: new Date().toLocaleString()})
  
    // const property = req.body;

    // const newProperty = new newProperty({ ...property, creator: req.agentId, createdAt: new Date().toISOString()})
    try {
        await newProperty.save();

        res.status(201).json(newProperty);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateProperty = async (req, res) => {
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { id } = req.params;

    const {  title, address, estateName, buildingName, developer, bathroom, buildingYear,logo, companyAddress, companyName,
        category,location, description, electricity, images, kitchen, lotSize, lga, livingRoom, serviceCharge,
        paymentType, postCode,  price, propertyGroup, propertyTax, propertyTitle, propertyType, showerRoom,
        size, state, street, tax, tour, uniqNo, ultilities, video, water, yearRenovated, comfort,
        condition, hvac, parking, pets, security, slideImages, phone, email } = req.body;
        const options = {
            provider: 'google',
          
            // Optional depending on the providers
            //fetch: customFetchImplementation,
            apiKey: process.env.LOCATION_KEY, // for Mapquest, OpenCage, Google Premier
            formatter: null // 'gpx', 'string', ...
          };
          const geocoder = NodeGeocoder(options);
          const response = await geocoder.geocode(address);
          const longitude = Number(response.map(long => long.longitude));
          const latitude = Number(response.map(lat => lat.latitude));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const updatedProperty = { longitude, latitude, category, title, address, estateName, buildingName, developer, bathroom, bathroom, buildingYear, phone: req.phone, email: req.email,
        category,location, description, electricity, images, kitchen, lotSize, lga, livingRoom, serviceCharge,
        paymentType, postCode,  price, propertyGroup, propertyTax, propertyTitle, propertyType, showerRoom,
        size, state, street, tax, tour, uniqNo, ultilities, video, water, yearRenovated, comfort, slideImages,
        condition, hvac, parking, pets, security, createdAt: new Date().toLocaleString(), companyId: req.companyId,
        logo: req.companyLogo, companyAddress: req.companyAddress, companyName: req.companyName, name: req.name, profilePicture: req.profilePicture,
    };

    await Property.findByIdAndUpdate(id, updatedProperty, { new: true });                    

    res.json(updatedProperty);

 }

 export const deleteProperty = async (req, res) => {
   // res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});             
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');

    await Property.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'});

  }
  
  export const companyProperties = async (req, res) => {
    //res.set({"Access-Control-Allow-Origin": "https://my-property-finder.vercel.app"});
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Property doesn't exist" });
    }
    const companyProperty = await Property.find({ companyId: id });
    res.status(200).json(companyProperty);
  };



//   export const likePost = async (req, res) => {
//     const { id } = req.params;

//     if(!req.userId) return res.json({ message: 'Unauthenticated' });

//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
//     const post = await PostMessage.findById(id);

//     const index = post.likes.findIndex((id) => id === String(req.userId));

//     if(index === -1) {
//         post.likes.push(req.userId);
//     } else {
//         post.likes = post.likes.filter((id) => id !== String(req.userId));
//     }
    
//     const updatedPost = await PostMessage.findByIdAndUpdate( id, post, { new: true });
    
//     res.json(updatedPost);
   
// }

export  default router;
