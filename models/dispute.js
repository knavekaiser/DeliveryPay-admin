const disputeModel = new Schema(
  {
    issue: { type: String, required: true },
    dscr: { type: String },
    status: {
      type: String,
      enum: ["pending", "onGoing", "pendingVerdict", "closed"],
      default: "pending",
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    plaintiff: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      case: {
        dscr: { type: String },
        files: [{ type: String }],
      },
    },
    defendant: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      case: {
        dscr: { type: String },
        files: [{ type: String }],
      },
    },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
global.Dispute = mongoose.model("Dispute", disputeModel);
