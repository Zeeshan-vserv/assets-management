import mongoose from "mongoose";

const serviceAutoCloseSchema = new mongoose.Schema(
  {
    userId: String,
    autoCloseTimeId: Number,
    autoCloseTime: String,
  },
  { timestamps: true }
);

export const ServiceAutoCloseModel = mongoose.model(
  "ServiceAutoClose",
  serviceAutoCloseSchema
);

const serviceSubCategorySchema = mongoose.Schema({
    subCategoryId: Number,
    subCategoryName: String
})

const serviceCategorySchema = mongoose.Schema({
    userId: String,
    categoryId: Number,
    categoryName: String,
    subCategories: [serviceSubCategorySchema],
}, {timestamps: true})

export const ServiceCategoryModel = mongoose.model('ServiceCategory', serviceCategorySchema)
