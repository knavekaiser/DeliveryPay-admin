const express = require("express");
const webPush = require("web-push");
global.mongoose = require("mongoose");
global.Schema = mongoose.Schema;
global.passport = require("passport");
global.jwt = require("jsonwebtoken");
global.jwt_decode = require("jwt-decode");
global.bcrypt = require("bcryptjs");
global.ObjectId = require("mongodb").ObjectId;
global.fetch = require("node-fetch");
require("./models/user");
require("./models/dispute");
require("./models/payment");
require("./models/product");
require("./models/chat");
require("./models/support");
require("dotenv").config();
require("./mailService");
require("./smsService");
const PORT = process.env.PORT || 3002;
const URI = process.env.MONGO_URI;
const Razorpay = require("razorpay");
const path = require("path");

global.razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_ID,
  key_secret: process.env.RAZOR_PAY_SECRET,
});

const { handleSignIn } = require("./config/passport.js");
global.notify = (client, body, clientType) => {
  if (clientType) {
    const parsed = JSON.parse(body);
    mongoose.models[clientType]
      .findOneAndUpdate(
        { _id: client },
        { $push: { notifications: { ...parsed } } }
      )
      .then((notificationSaved) => {});
  }
  return NotificationSubscription.find({ client }).then((subscriptions) => {
    subscriptions.forEach((sub) => {
      const { endpoint, keys } = sub;
      const subscription = { endpoint, keys };
      return webPush.sendNotification(subscription, body).catch((err) => {
        console.log("could not send notification");
      });
    });
  });
};

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webPush.setVapidDetails(
  "mailto:support@deliverypay.in",
  publicVapidKey,
  privateVapidKey
);

global.app = express();

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("could not connect to db, here's why: " + err));

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("./config/passport");
app.use(passport.initialize());

app.get("/api/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ user: null, success: true });
});

// ------------------------------------------------------- OAuth
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/googleAuthcalllback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  handleSignIn
);
app.get("/api/auth/facebook", passport.authenticate("facebook"));
app.get(
  "/facebookAuthCallback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  handleSignIn,
  (err, req, res, next) => {
    res.status(401).json({ code: 401, message: "invalid credentials" });
  }
);

require("./routes/admin.js");
require("./routes/disputes.js");
require("./routes/chats.js");
require("./routes/data.js");
require("./routes/userManagement.js");
require("./routes/support.js");
require("./routes/notifications.js");
require("./routes/coupons.js");

// notification
app.post(
  "/api/subscribe",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    new NotificationSubscription({ ...req.body, client: req.user._id })
      .save()
      .then((dbRes) => {
        res.status(200).json({ message: "successfully subscribed" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.json({ message: "already subscribed" });
        } else {
          res.status(500).json({ message: "something went wrong" });
        }
      });
  }
);
app.delete(
  "/api/unsubscribe",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    NotificationSubscription.findOneAndDelete({ client: req.user._id })
      .then((dbRes) => {
        res.status(200).json({ message: "successfully unsubscribed" });
      })
      .catch((err) => {
        res.status(500).json({ message: "something went wrong" });
      });
  }
);

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);

const socketIO = require("socket.io");
global.io = socketIO(
  app.listen(PORT, () => {
    console.log("Delivery Pay - admin backend listening to port:", PORT);
  })
);

const parseCookies = (raw) => {
  const cookies = {};
  if (raw) {
    raw.split("; ").forEach((item, i) => {
      cookies[item.split("=")[0]] = item.split("=")[1];
    });
  }
  return cookies;
};
io.on("connection", async (socket) => {
  const {
    query: { room, type },
    headers: { cookie },
  } = socket.handshake;
  await jwt.verify(
    parseCookies(cookie).access_token || "",
    process.env.JWT_SECRET,
    async (err, decoded) => {
      if (decoded) {
        socket.on("initiateChat", async ({ client_id }) => {
          InitiateChat({ user: decoded.sub, client: client_id })
            .then(([userChat, clientChat]) => {
              socket.join(userChat._id.toString());
              socket.join(clientChat._id.toString());
              socket.emit("connectedToRoom", {
                rooms: [userChat._id, clientChat._id],
              });
            })
            .catch((err) => {
              console.log(err);
              socket.disconnect();
            });
        });
        socket.on("messageToServer", async ({ rooms, message }) => {
          SendMessage({
            rooms,
            message: {
              ...message,
              from: decoded.sub,
            },
          }).then((chatRes) => {
            if (chatRes) {
              notify(
                message.to,
                JSON.stringify({
                  title: "New message!",
                  body: message.text,
                }),
                "User"
              );
              io.to(rooms[0].toString())
                .to(rooms[1].toString())
                .emit("messageToUser", {
                  ...message,
                  from: decoded.sub,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
            } else {
              socket.emit("sendFail", { err: "room does not exists" });
            }
          });
        });
        socket.on("joinRooms", async ({ rooms }) => {
          rooms.forEach((room) => {
            socket.join(room);
          });
        });
      } else {
        console.log("could not verify for socket");
        socket.disconnect();
      }
    }
  );
});
