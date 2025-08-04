import IncidentCategoryModel from "../models/incidetCategoryModel.js";

export const createIncidentCategory = async (req, res) => {
    try {
        const { userId, categoryName, subCategories = []} = req.body

        if(!userId){
            return res.status(400).json({ message: 'User Id not found'})
        }

        if(!categoryName){
            return res.status(400).json({ message: 'Category name is required'})
        }

        // Get next categoryId
        const lastCategory = await IncidentCategoryModel.findOne().sort({ categoryId: -1})
        const nextCategoryId = lastCategory ? lastCategory.categoryId + 1 : 1

        // Assign serial subCategory
        const subCategoriesId = subCategories.map((sub, idx) => ({
            subCategoryId: idx + 1,
            subCategoryName: sub.subCategoryName

        }))

        const newCategory = new IncidentCategoryModel({
            userId,
            categoryId: nextCategoryId,
            categoryName,
            subCategories: subCategoriesId
        })

        await newCategory.save()

        res.status(201).json({ success: true, data: newCategory, message: 'Category created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating category', error: error.message });
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const category = await IncidentCategoryModel.find()
        res.status(200).json({ success: true, data: category})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching category'})
    }
}

export const getAllSubCategory = async (req, res) => {
    try {
        const category = await IncidentCategoryModel.find()
        const allSubCategory = category.flatMap(cat => cat.subCategories)
        res.status(200).json({ success: true, data: allSubCategory})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching subcategory' });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await IncidentCategoryModel.findById(id)

        if(!category){
            return res.status(404).json({ success: false, message:"Category not found"})
        }

        res.status(200).json({ success: true, data: category})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching category'})
    }
}

export const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await IncidentCategoryModel.find()
        for (const cat of category){
            const sub = cat.subCategories.id(id)
            if(sub){
                return res.status(200).json({ success: true, data: sub})
            }
        }
        res.status(404).json({ success: false, message: 'Sub Category not found'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching SubDepartment' });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const updateCategory = await IncidentCategoryModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updateCategory){
            return res.status(404).json({ success: false, message: 'Category Id not found'})
        }
        res.status(200).json({ success: true, data: updateCategory, message: 'Category updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating category'})
    }
}

export const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await IncidentCategoryModel.find()
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

export const addSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subCategoryName } = req.body;

        if (!subCategoryName) {
            return res.status(400).json({ success: false, message: 'subCategoryName name is required' });
        }

        const category = await IncidentCategoryModel.findById(categoryId);
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

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const deleteCategory = await IncidentCategoryModel.findByIdAndDelete(id)

        if(!deleteCategory){
            return res.status(404).json({success:false, message:'Category Id not found'})
        }
        res.status(200).json({ success: true, data: deleteCategory, message: 'Category deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting department' });

    }
}

export const deleteSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params;
        const category = await IncidentCategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category Id not found' });
        }

        // Try to match by MongoDB _id first
        let subIndex = category.subCategories.findIndex(
            (sub) => sub._id.toString() === subCategoryId
        );

        // If not found, try to match by custom subCategoryId (number)
        if (subIndex === -1) {
            subIndex = category.subCategories.findIndex(
                (sub) => sub.subCategoryId?.toString() === subCategoryId
            );
        }

        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'SubCategory not found' });
        }

        category.subCategories.splice(subIndex, 1);
        await category.save();
        res.status(200).json({ success: true, data: category, message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting subcategory', error: error.message });
    }
};
