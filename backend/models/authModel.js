import mongoose from "mongoose";

const authSchema = mongoose.Schema(
  {
    employeeName: String,
    employeeCode: String,
    emailAddress: String,
    mobileNumber: Number,
    designation: String,
    location: String,
    subLocation: String,
    department: String,
    subDepartment: String,
    reportingManager: String,
    departmentHead: String,
    businessHead: String,
    isVip: { type: Boolean, default: false },
    userRole: String,
    supportDepartmentName: String,
    supportGroups: String,
    password: String,
    confirmPassword: String,
    users: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    dashboard: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    components: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    departments: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    subDepartments: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    locations: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    subLocations: {
      isView: { type: Boolean, default: false },
      isEdit: { type: Boolean, default: false },
      isDelete: { type: Boolean, default: false },
    },
    assets: {
      isView: { type: Boolean, default: false },
    },
    tickets: {
      isView: { type: Boolean, default: false },
    },
    showUsers: {
      isView: { type: Boolean, default: false },
    },
    summary: {
      isView: { type: Boolean, default: false },
    },
    importAsset: {
      isView: { type: Boolean, default: false },
    },
    // Asset allocation history
    assetAllocationHistory: [
      {
        assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
        allocatedAt: { type: Date },
        deallocatedAt: { type: Date }, // null if still allocated
        status: { type: String }, // "Allocated" or "Deallocated"
      }
    ],
    // Incident history
    incidentHistory: [
      {
        incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
        reportedAt: { type: Date },
        status: { type: String },
      }
    ],
    // Service request history
    serviceRequestHistory: [
      {
        requestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest" },
        requestedAt: { type: Date },
        status: { type: String },
      }
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AuthModel = mongoose.model("Auth", authSchema);
export default AuthModel;