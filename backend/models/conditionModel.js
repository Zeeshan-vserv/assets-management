import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
    userId: String,
    conditionId: Number,
    conditionName: String
}, {timestamps: true})

const ConditionModel = mongoose.model('Condition', conditionSchema);
export default ConditionModel;