const adminModel = new Schema(
  {
    name: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    pass: { type: String },
    active: { type: Boolean, default: true },
    address: {
      street: { type: String },
      city: { type: String },
      zip: { type: Number },
      state: { type: String },
      country: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    gender: { type: String },
    age: { type: Number },
    notifications: [
      new Schema(
        {
          title: { type: String, required: true },
          body: { type: String, required: true },
          link: { type: String },
        },
        { timestamps: true }
      ),
    ],
    profileImg: { type: String, default: "/profile-user.jpg" },
  },
  { timestamps: true }
);
global.Admin = mongoose.model("Admin", adminModel);

const userModel = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    twitterId: { type: String, unique: true, sparse: true },
    userId: { type: String, unique: true, sparse: true },
    razorPayContactId: { type: String, unique: true, sparse: true },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    balance: { type: Number, default: 0 },
    email: { type: String, unique: true, sparse: true },
    pass: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      zip: { type: Number },
      state: { type: String },
      country: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    gender: { type: String },
    age: { type: Number },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    milestones: [{ type: Schema.Types.ObjectId, ref: "Milestone" }],
    active: { type: Boolean, default: true },
    contacts: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "connected", "silent", "blocked"],
          default: "connected",
        },
      },
    ],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    rewards: [{}],
    notifications: [
      new Schema(
        {
          title: { type: String, required: true },
          body: { type: String, required: true },
          link: { type: String },
        },
        { timestamps: true }
      ),
    ],
    paymentMethods: [{ type: Schema.Types.ObjectId, ref: "PaymentMethod" }],
    profileImg: { type: String, default: "/profile-user.jpg" },
  },
  { timestamps: true }
);
global.User = mongoose.model("User", userModel);

const notificationSubscriptionModel = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "Vendors" },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      auth: { type: String },
      p256dh: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
global.NotificationSubscription = mongoose.model(
  "NotificationSubscription",
  notificationSubscriptionModel
);

const OTPModel = new Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: "2m" } },
    attempt: { type: Number, default: 0 },
  },
  { timestamp: true }
);
global.OTP = mongoose.model("OTP", OTPModel);
