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
  User.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "logins",
        let: { user: "$_id" },
        as: "logins",
        pipeline: [{ $match: { $expr: { $eq: ["$user", "$$user"] } } }],
      },
    },
    {
      $set: { logins: { $size: "$logins" }, lastLogin: { $last: "$logins" } },
    },
    {
      $lookup: {
        from: "disputes",
        let: { user: "$_id" },
        as: "disputesStart",
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $eq: ["$$user", "$plaintiff._id"],
                  },
                ],
              },
            },
          },
        ],
      },
    },
    { $set: { disputesStart: { $size: "$disputesStart" } } },
    {
      $lookup: {
        from: "milestones",
        let: { user: "$_id" },
        as: "milestones",
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$buyer._id", "$$user"],
              },
            },
          },
          {
            $group: {
              _id: "$status",
              total: { $sum: "$amount" },
            },
          },
        ],
      },
    },
    { $set: { milestones_total: { $sum: "$milestones.total" } } },
    {
      $lookup: {
        from: "orders",
        as: "orders",
        let: { user: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$$user", "$seller._id"] },
                  { $eq: ["$$user", "$buyer._id"] },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$seller._id",
              total_rupee: { $sum: "$total" },
              total_qty: { $sum: { $sum: "$products.qty" } },
            },
          },
          {
            $set: {
              role: {
                $cond: {
                  if: {
                    $eq: ["$$user", "$_id"],
                  },
                  then: "sold",
                  else: "baught",
                },
              },
            },
          },
          { $facet: { orders: [] } },
          {
            $set: {
              bought: {
                $reduce: {
                  input: "$orders",
                  initialValue: {},
                  in: {
                    $cond: {
                      if: { $eq: ["$$this.role", "sold"] },
                      then: "$$this",
                      else: null,
                    },
                  },
                },
              },
              sold: {
                $reduce: {
                  input: "$orders",
                  initialValue: {},
                  in: {
                    $cond: {
                      if: { $eq: ["$$this.role", "sold"] },
                      then: "$$this",
                      else: null,
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              orders: 0,
              "bought._id": 0,
              "sold._id": 0,
            },
          },
        ],
      },
    },
    { $set: { orders: { $first: "$orders" } } },
    {
      $project: { notifications: 0 },
    },
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
      User.findOne({ _id }).then((user) => {
        if (user.balance > 0) {
          res.status(403).json({
            code: 403,
            message: "Can't delete user with balance in their wallet.",
          });
        } else {
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
        }
      });
    } else {
      res.status(400).json({ code: 400, message: "Valid _id is required." });
    }
  }
);
