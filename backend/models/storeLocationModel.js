import mongoose from "mongoose";

const storeLocationSchema = mongoose.Schema({
    userId: String,
    storeLocationId: Number,
    locationName: String,
    storeLocationName: String,
}, { timestamps: true });

const StoreLocationModel = mongoose.model('StoreLocation', storeLocationSchema);

export default StoreLocationModel;
