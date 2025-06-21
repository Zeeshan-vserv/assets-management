import mongoose from "mongoose";

const incidentCounterSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 1 }
});

const IncidentCounterModel = mongoose.model("IncidentCounter", incidentCounterSchema);

export default IncidentCounterModel;