import mongoose from "mongoose";

const subLocationSchema = mongoose.Schema({
    subLocationId: Number,
    subLocationName: String
})

const locationSchema = mongoose.Schema({
    locationId: Number,
    locationName: String,
    subLocations:[subLocationSchema]
}, {timestamps: true})

const LocationModel = mongoose.model('Location', locationSchema)

export default LocationModel