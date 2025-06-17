import mongoose from "mongoose";

const incidentSubCategorySchema = mongoose.Schema({
    subCategoryId: Number,
    subCategoryName: String
})

const incidentCategorySchema = mongoose.Schema({
    userId: String,
    categoryId: Number,
    categoryName: String,
    subCategories: [incidentSubCategorySchema],
}, {timestamps: true})

const IncidentCategoryModel = mongoose.model('Category', incidentCategorySchema)

export default IncidentCategoryModel