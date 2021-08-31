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
          expireAt: {
            type: Date,
            default: new Date().getTime() + 1000 * 60 * 60 * 24 * 14,
          },
          thumb: { type: String },
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
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    twitterId: { type: String, unique: true, sparse: true },
    userId: { type: String, unique: true, sparse: true },
    razorPayContactId: { type: String, unique: true, sparse: true },
    phone: {
      type: String,
      trim: true,
      unique: true,
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
          enum: ["pending", "connected", "silent"],
          default: "connected",
        },
      },
    ],
    blockList: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    rewards: [{ type: Schema.Types.ObjectId, ref: "Reward" }],
    notifications: [
      new Schema(
        {
          title: { type: String, required: true },
          body: { type: String, required: true },
          link: { type: String },
          expireAt: {
            type: Date,
            default: new Date().getTime() + 1000 * 60 * 60 * 24 * 14,
          },
          thumb: { type: String },
        },
        { timestamps: true }
      ),
    ],
    notificationLastRead: { type: Date },
    paymentMethods: [{ type: Schema.Types.ObjectId, ref: "PaymentMethod" }],
    profileImg: { type: String, default: "/profile-user.jpg" },
    kyc: {
      verified: { type: Boolean, default: false },
      files: [{ type: String }],
    },
    gst: {
      verified: { type: Boolean, default: false },
      detail: {
        reg: { type: String },
        files: [{ type: String }],
      },
      amount: { type: Number },
    },
    shopInfo: {
      shippingCost: { type: Number },
      deliveryWithin: { type: Number },
      refundable: { type: String },
      terms: [{ type: String }],
      paymentMethod: {
        name: { type: String },
        bank: { type: String },
        city: { type: String },
        accountType: { type: String },
        accountNumber: { type: String },
        ifsc: { type: String },
      },
    },
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
    expireAt: { type: Date, default: Date.now, index: { expires: "30m" } },
    attempt: { type: Number, default: 0 },
  },
  { timestamp: true }
);
global.OTP = mongoose.model("OTP", OTPModel);

const notificationModel = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    url: { type: String },
    pushed: { type: Number, default: 0 },
  },
  { timestamps: true }
);
global.Notification = mongoose.model("Notification", notificationModel);

const loginModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    ip: { type: String },
  },
  { timestamps: true }
);
global.Login = mongoose.model("Login", loginModel);
