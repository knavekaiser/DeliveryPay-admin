const transactionModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    note: { type: String },
  },
  { timestamps: true }
);
global.Transaction = mongoose.model("Transaction", transactionModel);
global.P2PTransaction = Transaction.discriminator(
  "P2PTransaction",
  new Schema({
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    client: {
      _id: { type: Schema.Types.ObjectId, ref: "User" },
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    dscr: { type: String },
  })
);
global.AddMoney = Transaction.discriminator(
  "AddMoney",
  new Schema({
    paymentMethod: { type: String },
    transactionId: { type: String, unique: true, sparse: true },
  })
);
global.WithdrawMoney = Transaction.discriminator(
  "WithdrawMoney",
  new Schema({
    paymentMethod: { type: String },
    transactionId: { type: String, unique: true, sparse: true },
  })
);

const milestoneModel = new Schema(
  {
    buyer: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      address: {},
    },
    seller: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      address: {},
    },
    status: {
      type: String,
      enum: [
        "pending",
        "inProgress",
        "pendingRelease",
        "released",
        "cancelled",
        "declined",
        "dispute",
        "pendingVerdict",
        "reverted",
      ],
      default: "pending",
    },
    product: {
      type: { type: String, required: true },
      dscr: { type: String, required: true },
      deliveryDetail: {
        timeOfDelivery: { type: Date },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        alternatePhone: { type: String },
        landmark: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        location: {
          type: { type: String, enum: ["Point"] },
          coordinates: [{ type: Number }],
        },
      },
    },
    releaseDate: { type: Date },
    amount: { type: Number, required: true },
    verification: { type: String, default: "smooth" },
    dispute: { type: Schema.Types.ObjectId, ref: "Dispute" },
  },
  { timestamps: true }
);
global.Milestone = mongoose.model("Milestone", milestoneModel);

const paymentMethodModel = new Schema(
  {
    dscr: { type: String },
  },
  { timestamps: true }
);
global.PaymentMethod = mongoose.model("PaymentMethod", paymentMethodModel);
global.BankAccount = PaymentMethod.discriminator(
  "BankAccount",
  new Schema({
    name: { type: String, required: true },
    ifsc: { type: String },
    bank: { type: String },
    accountNumber: { type: String, required: true },
  })
);
global.VpaAccount = PaymentMethod.discriminator(
  "VpaAccount",
  new Schema({
    username: { type: String },
    handle: { type: String },
    address: { type: String, required: true },
  })
);
global.BankCard = PaymentMethod.discriminator(
  "BankCard",
  new Schema({
    brand: { type: String },
    cardNumber: { type: String, required: true },
    nameOnCard: { type: String, required: true },
    exp: { type: String, required: true },
    cvv: { type: String, required: true },
  })
);
