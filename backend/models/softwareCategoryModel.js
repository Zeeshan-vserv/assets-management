import mongoose from "mongoose";

const softwareCategorySchema = mongoose.Schema({
    softwareCategoryId: Number,
    softwareCategoryName: String
})

const publisherSchema = mongoose.Schema({
    publisherId : Number,
    publisherName : String,
})

const softwareShema = mongoose.Schema({
    softwareNameId: Number,
    softwareName: String,
    publishers: [publisherSchema],
    softwareCategory: [softwareCategorySchema]
}, { timestamps: true})

const SoftwareCategoryModel = mongoose.model('SoftwareCategory', softwareShema)

export default SoftwareCategoryModel