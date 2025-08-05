import mongoose from "mongoose";

const gatePassSchema = mongoose.Schema(
  {
    userId: String,
    gatePassId: String,
    movementType: String,
    gatePassType: String,
    expectedReturnDate: Date,
    fromAddress: String,
    gatePassValidity: String,
    approvalRequired: { type: Boolean, default: false },
    approverLevel1: String,
    approverLevel2: String,
    approverLevel3: String,
    toAddress: String,
    remarks: String,
    reasonForGatePass: String,
    toBeReceivedBy: String,
    receiverNo: String,
    attachment: String,
    assetType: String,
    // asset: String,
    asset: [],
    // assetComponent: String,
    assetComponent: [],
    consumables: [
      {
        sNo: Number,
        itemName: String,
        serialNo: String,
        qty: Number,
      },
    ],
    others: {
      itemName: String,
      quantity: String,
      description: String,
    },
  },
  { timestamps: true }
);

const GatePass = mongoose.model("GatePass", gatePassSchema);

export default GatePass;
