import mongoose from "mongoose";

const incidentAutoCloseSchema = new mongoose.Schema(
  {
    userId: String,
    autoCloseTimeId: Number,
    autoCloseTime: String,
  },
  { timestamps: true }
);

export const IncidentAutoCloseModel = mongoose.model(
  "IncidentAutoClose",
  incidentAutoCloseSchema
);

const incidentClosureCodeSchema = new mongoose.Schema(
  {
    userId: String,
    closureCodeId: Number,
    closureCodeValue: String,
  },
  { timestamps: true }
);

export const IncidentAutoClosureCodeModel = mongoose.model(
  "IncidentAutoClosureCode",
  incidentClosureCodeSchema
);

const incidentPredefinedResponseSchema = new mongoose.Schema(
  {
    userId: String,
    predefinedResponseId: Number,
    predefinedTitle: String,
    predefinedContent: String,
  },
  { timestamps: true }
);

export const IncidentPredefinedResponseModel = mongoose.model(
  "IncidentPredefinedResponse",
  incidentPredefinedResponseSchema
);

const incidentPendingReasonSchema = new mongoose.Schema(
  {
    userId: String,
    pendingReasonId: Number,
    pendingReason: String,
  },
  { timestamps: true }
);

export const IncidentPendingReasonModel = mongoose.model(
  "IncidentPendingReason",
  incidentPendingReasonSchema
);

const incidentRuleSchema = new mongoose.Schema(
  {
    userId: String,
    ruleName: String,
    priority: String,
    addConditions: [
      {
        condition: String,
        conditionValue: String,
        assetLocation: String,
        userLocation: String,
        assetCategory: String,
        asset: String,
        assetCriticality: String,
        incidentSubCategory: String,
      },
    ],
    assignTo: {
      supportDepartment: String,
      supportGroup: String,
      technician: String,
      severityLevel: String,
    },
  },
  { timestamps: true }
);

export const IncidentRuleModel = mongoose.model(
  "IncidentRule",
  incidentRuleSchema
);
