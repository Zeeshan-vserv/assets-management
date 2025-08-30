import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  data: Object,
  position: Object,
});

const edgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  label: String,
});

const ticketFlowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TicketFlow", ticketFlowSchema);