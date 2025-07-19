import { ServiceAutoCloseModel, ServiceCategoryModel } from "../models/globalServiceReqModel.js";
import ServiceCounterModel from "../models/serviceCounterModel.js";

//Service Auto Close Time
export const createAutoCloseTime = async (req, res) => {
    try {
        const { userId, autoCloseTime} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!autoCloseTime){
            return res.status(400).json({ message: 'Close time is required'})
        }

        // Get next auto close time Id
                const lastCloseTime = await ServiceAutoCloseModel.findOne().sort({ autoCloseTimeId: -1 });
                const nextCloseTimeId = lastCloseTime ? lastCloseTime.autoCloseTimeId + 1 : 1;

        const newAutoClose = new ServiceAutoCloseModel({
            userId,
            autoCloseTimeId: nextCloseTimeId,
            autoCloseTime
        })

        await newAutoClose.save();
        res.status(201).json({ success: true, data: newAutoClose, message: 'Auto close created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating auto close time'})
    }
}

export const getAllAutoCloseTimes = async (req, res) => {
    try {
        const autoCloseTime = await ServiceAutoCloseModel.find()
        res.status(200).json({ success: true, data: autoCloseTime})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAutoCloseTimeById = async (req, res) => {
    try {
        const { id } = req.params
        const autoCloseTime = await ServiceAutoCloseModel.findById(id);
        if(!autoCloseTime){
            return res.status(404).json({ success: false, message: 'Auto close not found'})
        }
        res.status(200).json({ success:true, data: autoCloseTime})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto close time'})
    }
}

export const updateAutoCloseTime = async (req, res) => {
    try {
        const { id } = req.params
        const autoCloseTimeData = await ServiceAutoCloseModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!autoCloseTimeData) {
            return res.status(40).json({ success: false, message: 'Auto close time not found'})
        }
        res.status(200).json({ success: true, data: autoCloseTimeData, message: 'Auto close time updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto close time'})
    }
}

export const deleteAutoCloseTime = async (req, res) => {
    try {
        const { id }= req.params
        const deletedAutoCloseTime = await ServiceAutoCloseModel.findByIdAndDelete(id)
        if (!deletedAutoCloseTime){
            return res.status(404).json({ success: false, message: 'Auto close time not found'})
        }
        res.status(200).json({ success: true, message: 'Auto close time deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting auto close time'})
    }
}

// Service Category
export const createServiceCategory = async (req, res) => {
    try {
        const { userId, categoryName, subCategories = []} = req.body

        if(!userId){
            return res.status(400).json({ message: 'User Id not found'})
        }

        if(!categoryName){
            return res.status(400).json({ message: 'Category name is required'})
        }

        // Get next categoryId
        const lastCategory = await ServiceCategoryModel.findOne().sort({ categoryId: -1})
        const nextCategoryId = lastCategory ? lastCategory.categoryId + 1 : 1

        // Assign serial subCategory
        const subCategoriesId = subCategories.map((sub, idx) => ({
            subCategoryId: idx + 1,
            subCategoryName: sub.subCategoryName

        }))

        const newServiceCategory = new ServiceCategoryModel({
            userId,
            categoryId: nextCategoryId,
            categoryName,
            subCategories: subCategoriesId
        })

        await newServiceCategory.save()

        res.status(201).json({ success: true, data: newServiceCategory, message: 'Service Category created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating service category', error: error.message });
    }
}

export const getAllServiceCategory = async (req, res) => {
    try {
        const category = await ServiceCategoryModel.find()
        res.status(200).json({ success: true, data: category})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching service category'})
    }
}

export const getAllServiceSubCategory = async (req, res) => {
    try {
        const category = await ServiceCounterModel.find()
        const allSubCategory = category.flatMap(cat => cat.subCategories)
        res.status(200).json({ success: true, data: allSubCategory})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching subcategory' });
    }
}

export const getServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await ServiceCategoryModel.findById(id)

        if(!category){
            return res.status(404).json({ success: false, message:"Category not found"})
        }

        res.status(200).json({ success: true, data: category})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching category'})
    }
}

export const getServiceSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await ServiceCategoryModel.find()
        for (const cat of category){
            const sub = cat.subCategories.id(id)
            if(sub){
                return res.status(200).json({ success: true, data: sub})
            }
        }
        res.status(404).json({ success: false, message: 'Sub Category not found'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching service sub category' });
    }
}

export const updateServiceCategory = async (req, res) => {
    try {
        const { id } = req.params
        const updateCategory = await ServiceCategoryModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updateCategory){
            return res.status(404).json({ success: false, message: 'Category Id not found'})
        }
        res.status(200).json({ success: true, data: updateCategory, message: 'Category updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating category'})
    }
}

export const updateServiceSubCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await ServiceCategoryModel.find()
        for (const cat of category){
            const sub = cat.subCategories.id(id)
            if(sub){
                Object.assign(sub, req.body)
                await cat.save()
                return res.status(200).json({ success: true, message: 'Sub Category updated successfully'})
            }
        }
        res.status(404).json({ success: false, message: 'Sub Category Id is not found'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating subdepartment' });
    }
}

export const addServiceSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subCategoryName } = req.body;

        if (!subCategoryName) {
            return res.status(400).json({ success: false, message: 'subCategoryName name is required' });
        }

        const category = await ServiceCategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Find the next serial subdepartmentId
        const lastSub = category.subCategories.length > 0
            ? Math.max(...category.subCategories.map(sub => sub.subCategoryId))
            : 0;
        const nextSubId = lastSub + 1;

        // Add the new subdepartment
        category.subCategories.push({
            subCategoryId: nextSubId,
            subCategoryName
        });

        await category.save();

        res.status(201).json({
            success: true,
            data: category,
            message: 'Subcategory added successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding subcategory', error: error.message });
    }
};

export const deleteServiceCategory = async (req, res) => {
    try {
        const { id } = req.params
        const deleteCategory = await ServiceCategoryModel.findByIdAndDelete(id)

        if(!deleteCategory){
            return res.status(404).json({success:false, message:'Category Id not found'})
        }
        res.status(200).json({ success: true, data: deleteCategory, message: 'Category deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting department' });

    }
}

export const deleteServiceSubCategory = async ( req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params
        const category = await ServiceCategoryModel.findById(categoryId)
        if(!category){
            return res.status(404).json({ success: false, message: 'Category Id not found'})
        }
        const subIndex = category.subCategories.findIndex(
            (sub) => sub._id.toString() === subCategoryId
        )
        if(subIndex === -1){
            return res.status(404).json({ success: false, message: 'SubCategory not found'})
        }
        category.subCategories.splice(subIndex, 1)
        await category.save()
        res.status(200).json({ success: true, data: category, message: 'Subcategory deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting subcategory' });

    }
}