import mongoose  from "mongoose";

const authSchema = mongoose.Schema(
    {
        businessUnit : String,
        employeeName : String,
        employeeCode : String,
        grade : String,
        emailAddress : String,
        mobileNumber : Number,
        designation : String,
        costCentre : String,
        location : String,
        subLocation : String,
        department : String,
        subDepartment : String,
        reportingManager: String,
        departmentHead : String,
        businessHead : String,
        vipUser : String,
        password : String,
        confirmPassword : String
    },
    { timestamps: true}
)

const AuthModel = mongoose.model('Auth', authSchema )
export default AuthModel