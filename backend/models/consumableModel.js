import mongoose from "mongoose";

const subConsumableSchema = mongoose.Schema({
    subConsumableId: Number,
    subConsumableName: String,
})

const consumableSchema = mongoose.Schema({
    userId: String,
    consumableId: Number,
    consumableName: String,
    subConsumables: [subConsumableSchema],
}, { timestamps: true})

const ConsumableModel = mongoose.model('Consumable', consumableSchema);
export default ConsumableModel;