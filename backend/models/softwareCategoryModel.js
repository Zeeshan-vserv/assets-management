import mongoose from "mongoose";

const softwareCategorySchema = mongoose.Schema({
    softwareCategoryId: Number,
    softwareCategoryName: String
}, { timestamps: true})

export const SoftwareCategoryModel = mongoose.model('SoftwareCategory', softwareCategorySchema)



const publisherSchema = mongoose.Schema({
    publisherId : Number,
    publisherName : String,
}, { timestamps: true})

export const PublisherModel = mongoose.model('Publisher', publisherSchema)


const softwareShema = mongoose.Schema({
    softwareNameId: Number,
    softwareName: String,
    publisher: String,
    softwareCategory: String
}, { timestamps: true})

export const SoftwareModel = mongoose.model('SoftwareName', softwareShema)
