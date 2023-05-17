import mongoose from 'mongoose';

const { Schema } = mongoose;
//Schema.Types.ObjectId
const propertySchema = new Schema({
    id: String,
    category:  String,
    title: String,
    address: String,     
    estateName: String,
    buildingName: String,
    developer: String,
    bedroom: Number,
    // agent:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }],
    bathroom: Number,
    buildingYear: Number,
    location: String,
    description: String,
    electricity: Number,
    house: Number,
    images: [],
    kitchen: Number,
    lotSize: Number,
    lga: String,
    livingRoom: Number,
    serviceCharge: Number,
    paymentType: String,
    postCode: Number,
    price:  Number,
    propertyGroup: String,
    propertyTax: Number,
    propertyTitle: String,
    propertyType: String,
    showerRoom: Number,
    size: Number,
    state: String,
    street: String,
    taxes: String,
    tour: String,
    uniqNo: Number,
    ultilities:[],
    video: String,
    water: Number,
    yearRenovated: Number,
    comfort: [],
    condition: String,
    hvac: [],
    parking: [],
    pets: [],
    security: [],
    creator: String,
    createdAt: String,
    companyName: String,
    logo: String,
    companyId: String,
    companyAddress: String,
    name: String,
    profilePicture: String,
    slideImages: [],
    phone: String,
    email: String,
    longitude: Number,
    latitude: Number,
    featured: String,
    building: String,
    estate: String,

})

const Property = mongoose.model('Property', propertySchema);

export default Property;