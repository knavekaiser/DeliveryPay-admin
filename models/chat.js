const chatModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      new Schema(
        {
          type: { type: String },
          from: { type: Schema.Types.ObjectId, ref: "User", required: true },
          to: { type: Schema.Types.ObjectId, ref: "User", required: true },
          text: { type: String, required: true },
          media: { type: String },
        },
        { timestamps: true }
      ),
    ],
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
chatModel.index({ user: 1, client: 1 }, { unique: true });
global.Chat = mongoose.model("Chat", chatModel);
