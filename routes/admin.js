const { handleSignIn, signingIn, genCode } = require("../config/passport.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const adminid = payload["sub"];
  return adminid || null;
}

// app.post("/api/registerAdmin", (req, res) => {
//   const { name, phone, password } = req.body;
//   if (name && phone && password) {
//     bcrypt
//       .hash(password, 10)
//       .then((hash) => {
//         return new Admin({
//           ...req.body,
//           pass: hash,
//         }).save();
//       })
//       .then((dbRes) => {
//         if (dbRes) {
//           signingIn(dbRes._doc, res);
//         } else {
//           res.status(500).json({
//             code: 500,
//             message: "Cound not save to database",
//             success: false,
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         if (err.code === 11000) {
//           res.status(409).json({
//             message: "phone already exists",
//             code: 409,
//             success: false,
//           });
//         } else {
//           console.log(err);
//           res.status(500).json({
//             code: 500,
//             message: "database error",
//             success: false,
//           });
//         }
//       });
//   } else {
//     res.status(400).json({
//       code: 400,
//       message: "missing fields",
//       requiredFileds: "name, phone, email, password",
//       fieldsFound: req.body,
//       success: false,
//     });
//   }
// });
app.post(
  "/api/adminLogin",
  passport.authenticate("admin", { session: false, failWithError: true }),
  handleSignIn,
  (err, req, res, next) => {
    console.log(err);
    res.status(401).json({ code: 401, message: "invalid credentials" });
  }
);
app.get(
  "/api/authAdmin",
  passport.authenticate("adminPrivate"),
  async (req, res) => {
    const admin = await Admin.aggregate([
      { $match: { _id: req.user._id } },
      {
        $lookup: {
          from: "paymentmethods",
          localField: "paymentMethods",
          foreignField: "_id",
          as: "paymentMethods",
        },
      },
    ]);
    if (admin.length) {
      signingIn(admin[0], res);
    } else {
      res.status(401).json({ message: "not logged in" });
    }
  },
  (err, req, res, next) => {
    console.log(err);
    res.status(401).json({ code: 401, message: "invalid credentials" });
  }
);
app.post("/api/adminLoginUsingSocial", async (req, res) => {
  const { googleToken, facebookId } = req.body;
  const googleId = await verify(googleToken);
  if (googleId || facebookId) {
    const query = {
      ...(req.body.googleId && { googleId }),
      ...(req.body.facebookId && { facebookId }),
    };
    Admin.findOne(query)
      .then((admin) => {
        if (admin.length) {
          signingIn(admin[0], res);
        } else {
          res.status(401).json({ code: 401, message: "Admin does not exist." });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "database error" });
      });
  } else {
    res.status(401).json({ code: 401, message: "admin not logged in" });
  }
});

app.get(
  "/api/viewAdminProfile",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    delete req.user._doc.pass;
    res.json(req.user._doc);
  }
);
app.patch(
  "/api/editAdminProfile",
  passport.authenticate("adminPrivate"),
  async (req, res) => {
    Admin.findOneAndUpdate(
      { _id: req.user._id },
      {
        ...req.body,
        ...(req.body.password && {
          pass: await bcrypt.hash(req.body.password, 10),
        }),
      },
      { new: true }
    )
      .then((admin) => {
        delete admin._doc.pass;
        res.json({ code: "ok", message: "profile updated", user: admin._doc });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  }
);

app.post("/api/sendAdminOTP", async (req, res) => {
  const { phone } = req.body;
  const code = genCode(6);
  console.log(code);
  const [admin, hash] = await Promise.all([
    Admin.findOne({ phone }),
    bcrypt.hash(code, 10),
    OTP.findOneAndDelete({ id: phone }),
  ]);
  if (admin) {
    new OTP({
      id: req.body.phone,
      code: hash,
    })
      .save()
      .then((dbRes) => {
        if (dbRes) {
          // send text massage here
          res.json({
            code: "ok",
            message: "6 digit code has been sent, enter it within 2 minutes",
          });
        } else {
          res.status(500).json({ code: 500, message: "something went wrong" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "someting went wrong" });
      });
  } else {
    res.status(400).json({ code: 400, message: "user does not exists" });
  }
});
app.put("/api/submitAdminOTP", async (req, res) => {
  const { phone, code } = req.body;
  const dbOtp = await OTP.findOne({ id: phone });
  if (!dbOtp) {
    res.status(404).json({ message: "code does not exists" });
    return;
  }
  if (bcrypt.compareSync(code, dbOtp.code)) {
    Admin.findOne({ phone }).then((dbAdmin) => {
      const admin = JSON.parse(JSON.stringify(dbAdmin));
      signingIn(admin, res);
    });
  } else {
    if (dbOtp.attempt > 2) {
      OTP.findOneAndDelete({ id: phone }).then(() => {
        res.status(429).json({ code: 429, message: "start again" });
      });
    } else {
      dbOtp.updateOne({ attempt: dbOtp.attempt + 1 }).then(() => {
        res.status(400).json({
          code: 400,
          message: "wrong code",
          attempt: dbOtp.attempt + 1,
        });
      });
    }
  }
});

app.post("/api/sendAdminForgotPassOTP", async (req, res) => {
  const { phone, email } = req.body;
  const code = genCode(6);
  const [admin, hash] = await Promise.all([
    Admin.findOne({ $or: [{ phone }, { email }] }),
    bcrypt.hash(code, 10),
    OTP.findOneAndDelete({ id: phone || email }),
  ]);
  if (admin) {
    new OTP({
      id: phone || email,
      code: hash,
    })
      .save()
      .then((dbRes) => {
        if (dbRes) {
          if (email) {
            sendEmail({
              from: {
                name: "Delivery Pay Support",
                address: "support@deliverypay.in",
              },
              to: email,
              subject: "Delivery Pay password recovery",
              text: `Hello,\nYour password reset code is ${code}. \nDelivery Pay.`,
            })
              .then((emailRes) => {
                console.log(dbRes);
                res.json({
                  message:
                    "6 digit code has been sent, enter it within 2 minutes",
                });
              })
              .catch((err) => {
                console.log(err);
                res
                  .status(500)
                  .json({ code: 500, message: "Could not send Email" });
              });
          } else if (true) {
            // send text massage or email here
            res.json({
              message: "6 digit code has been sent, enter it within 2 minutes",
            });
          }
        } else {
          res.status(500).json({ code: 500, message: "database error" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "database error" });
      });
  } else {
    res.status(400).json({ code: 400, message: "user does not exists" });
  }
});
app.put("/api/submitAdminForgotPassOTP", async (req, res) => {
  const { phone, email, code } = req.body;
  const dbOtp = await OTP.findOne({ id: phone || email });
  if (!dbOtp) {
    res.status(400).json({ code: 400, message: "code does not exists" });
    return;
  }
  if (bcrypt.compareSync(code, dbOtp.code)) {
    OTP.findOneAndUpdate(
      { _id: dbOtp._id },
      { expireAt: new Date(new Date().getTime() + 120000) }
    )
      .then(() => {
        res.json({ code: "ok", message: "OTP correct" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "database error" });
      });
  } else {
    if (dbOtp.attempt > 2) {
      OTP.findOneAndDelete({ id: phone || email }).then(() => {
        res.status(429).json({ code: 429, message: "start again" });
      });
    } else {
      dbOtp.updateOne({ attempt: dbOtp.attempt + 1 }).then(() => {
        res.status(400).json({
          code: 400,
          message: "wrong code",
          attempt: dbOtp.attempt + 1,
        });
      });
    }
  }
});
app.patch("/api/adminResetPass", async (req, res) => {
  const { phone, email, code, newPass } = req.body;
  const dbOtp = await OTP.findOne({ id: phone || email });
  if (!dbOtp) {
    res.status(400).json({ code: 400, message: "code does not exists" });
    return;
  }
  if (bcrypt.compareSync(code, dbOtp.code)) {
    bcrypt
      .hash(newPass, 10)
      .then((hash) =>
        Admin.findOneAndUpdate({ $or: [{ phone }, { email }] }, { pass: hash })
      )
      .then((dbAdmin) => {
        signingIn(dbAdmin._doc, res);
      });
  } else {
    if (dbOtp.attempt > 2) {
      OTP.findOneAndDelete({ id: phone }).then(() => {
        res
          .status(429)
          .json({ code: 429, message: "too many attempts, start again." });
      });
    } else {
      dbOtp.updateOne({ attempt: dbOtp.attempt + 1 }).then(() => {
        res.status(400).json({
          code: 400,
          message: "wrong code",
          attempt: dbOtp.attempt + 1,
        });
      });
    }
  }
});
