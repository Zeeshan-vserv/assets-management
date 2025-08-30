import TicketFlow from "../models/ticketFlowModel.js";

export const saveFlow = async (req, res) => {
  const { name, nodes, edges, createdBy } = req.body;
  const flow = new TicketFlow({ name, nodes, edges, createdBy });
  await flow.save();
  res.json({ success: true, flow });
};

export const getFlow = async (req, res) => {
  const { name } = req.params;
  const flow = await TicketFlow.findOne({ name });
  res.json({ success: !!flow, flow });
};