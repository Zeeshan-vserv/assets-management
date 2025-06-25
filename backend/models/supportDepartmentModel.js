import mongoose from 'mongoose'

const supportGroupSchema = mongoose.Schema({
    supportGroupId: Number,
    supportGroupName: String
})

const supportDepartmentSchema = mongoose.Schema({
    userId:String,
    supportDepartmentId: Number,
    supportDepartmentName: String,
    supportGroups: [supportGroupSchema], 
}, {timestamps: true})

const SupportDepartmentModel = mongoose.model('SupportDepartment', supportDepartmentSchema)

export default SupportDepartmentModel