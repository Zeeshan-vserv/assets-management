import mongoose from "mongoose";

const componentSchema = mongoose.Schema({
    componentId: {type: Number},
    componentName: {type: String}
},
    { timestamps: true}
)

const ComponentModel = mongoose.model('Components', componentSchema)

export default ComponentModel
