import mongoose from "mongoose";

const serviceCounterSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 1 }
});

const ServiceCounterModel = mongoose.model("ServiceCounter", serviceCounterSchema);

export default ServiceCounterModel;