import mongoose from 'mongoose'

const subDepartmentSchema = mongoose.Schema({
    subdepartmentId: Number,
    subdepartmentName: String
})

const departmentSchema = mongoose.Schema({
    departmentId: Number,
    departmentName: String,
    subdepartments: [subDepartmentSchema], 
}, {timestamps: true})

const DepartmentModel = mongoose.model('Department', departmentSchema)

export default DepartmentModel