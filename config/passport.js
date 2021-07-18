const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const FacebookStrategy = require("passport-facebook").Strategy;
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
};

const signToken = (_id) => {
  return jwt.sign({ iss: "deliveryPay", sub: _id }, process.env.JWT_SECRET);
};
const signingIn = (admin, res) => {
  const token = signToken(admin._id);
  ["pass", "__v"].forEach((key) => delete admin[key]);
  res.cookie("access_token", token, { httpOnly: true, sameSite: true });
  res.status(200).json({ code: "ok", isAuthenticated: true, user: admin });
};
const handleSignIn = async (req, res) => {
  signingIn(req.user._doc, res);
};

function genCode(length) {
  if (length <= 0) return;
  var result = "";
  while (result.length < length) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// ----------------- Admins
passport.use(
  "admin",
  new LocalStrategy((username, password, next) => {
    Admin.findOne({
      $or: [{ email: username }, { phone: username }],
      active: true,
    })
      .then((admin) => {
        if (admin && bcrypt.compareSync(password, admin.pass))
          return next(null, admin);
        return next(null, false);
      })
      .catch((err) => next(err, false));
  })
);
passport.use(
  "adminPrivate",
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
    (payload, next) => {
      Admin.findOne({ _id: payload.sub, active: true })
        .then((admin) => (admin ? next(null, admin) : next(null, false)))
        .catch((err) => next(err, false));
    }
  )
);

// ----------------- OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3003/googleAuthcalllback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      Admin.findOne({ email: profile.email }).then((admin) => {
        if (admin) {
          return done(null, admin);
        } else {
          return done(null, null);
        }
      });
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3003/facebookAuthCallback",
    },
    function (accessToken, refreshToken, profile, done) {
      Admin.findOne({ facebookId: profile.id }).then((admin) => {
        if (admin) {
          return done(null, admin);
        } else {
          return done(null, null);
        }
      });
    }
  )
);

passport.serializeUser((adminData, next) => {
  const admin = {
    type: "admin",
    adminId: adminData._id,
  };
  return next(null, admin);
});
passport.deserializeUser((admin, next) => {
  Admin.findOne({ $or: [{ email: admin._id }, { phone: admin._id }] })
    .then((admin) => next(null, admin))
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = { handleSignIn, signingIn, signToken, genCode };
