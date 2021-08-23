app.get("/api/users", passport.authenticate("adminPrivate"), (req, res) => {
  const { page, perPage, sort, order, q, dateFrom, dateTo } = req.query;
  const sortOrder = {
    [sort || "createdAt"]: order === "asc" ? 1 : -1,
  };
  const query = {
    ...(q && {
      $or: [
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  "$firstName",
                  " ",
                  "$lastName",
                  " ",
                  "$userId",
                  " ",
                  "$phone",
                ],
              },
              regex: q,
              options: "i",
            },
          },
        },
        ...(ObjectId.isValid(q) ? [{ _id: ObjectId(q) }] : []),
      ],
    }),
    ...(dateFrom &&
      dateTo && {
        createdAt: {
          $gte: new Date(dateFrom),
          $lt: new Date(dateTo),
        },
      }),
  };
  console.log(query, q, ObjectId.isValid(q));
  User.aggregate([
    { $match: query },
    { $sort: sortOrder },
    {
      $facet: {
        users: [
          { $skip: +perPage * (+(page || 1) - 1) },
          { $limit: +(perPage || 20) },
        ],
        total: [{ $group: { _id: null, count: { $sum: 1 } } }],
      },
    },
    { $set: { total: { $first: "$total.count" } } },
  ])
    .then(([{ users, total }]) => {
      res.json({ code: "ok", users, total: total || 0 });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ code: 500, message: "database error" });
    });
});

app.post("/api/addUser", passport.authenticate("adminPrivate"), (req, res) => {
  const { firstName, lastName, phone, password } = req.body;
  if (firstName && lastName && phone && password) {
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        return new User({
          ...req.body,
          pass: hash,
          userId: `${firstName}_${lastName}_${new Date().getTime()}`,
        }).save();
      })
      .then((dbRes) => {
        if (dbRes) {
          res.json({ code: "ok", message: "User has been added", user: dbRes });
        } else {
          res.status(500).json({ message: "something went wrong" });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          res.status(400).json({
            message: "email or phone already exists.",
            code: 409,
            field: Object.keys(err.keyValue)[0],
          });
        } else {
          console.log(err);
          res.status(500).json({ message: "something went wrong" });
        }
      });
  } else {
    console.log("res");
    res.status(400).json({
      code: 400,
      message: "Incomplete request",
      fieldsRequired: "firstName, lastName, phone, email, password",
      fieldsFound: req.body,
    });
  }
});

app.patch(
  "/api/editUser",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      User.findOneAndUpdate(
        { _id },
        {
          ...req.body,
          ...(req.body.password && {
            pass: bcrypt.hashSync(req.body.password, 10),
          }),
        },
        { new: true }
      ).then((dbRes) => {
        if (dbRes) {
          res.json({
            code: "ok",
            message: "User has been updated",
            user: dbRes,
          });
        } else {
          res.json({ code: 400, message: "User does not exists" });
        }
      });
    } else {
      res.status(400).json({ code: 400, message: "Valid _id is required." });
    }
  }
);

app.delete(
  "/api/deleteUser",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      User.findOneAndDelete({ _id }).then((dbRes) => {
        if (dbRes) {
          res.json({
            code: "ok",
            message: "User has been deleted",
            user: dbRes,
          });
        } else {
          res.json({ code: 400, message: "User does not exists" });
        }
      });
    } else {
      res.status(400).json({ code: 400, message: "Valid _id is required." });
    }
  }
);
