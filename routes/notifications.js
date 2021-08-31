app.get(
  "/api/notifications",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { q, page, perPage, sort, order } = req.query;
    const query = {
      ...(q && {
        $or: [{ title: new RegExp(q, "gi") }, { body: new RegExp(q, "gi") }],
      }),
    };
    const sortOrder = {
      [sort || "createdAt"]: order === "asc" ? 1 : -1,
    };
    Notification.aggregate([
      { $match: query },
      { $sort: sortOrder },
      {
        $facet: {
          notifications: [
            { $skip: +perPage * (+(page || 1) - 1) },
            { $limit: +(perPage || 20) },
          ],
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
      { $set: { total: { $first: "$total.count" } } },
    ])
      .then(([{ notifications, total }]) => {
        res.json({ code: "ok", notifications, total });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "something went wrong" });
      });
  }
);

app.post(
  "/api/addNotification",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { title, body } = req.body;
    if (title && body) {
      new Notification({ ...req.body })
        .save()
        .then((dbRes) => {
          res.json({ code: "ok", notification: dbRes });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "Database error." });
        });
    } else {
      res.status(400).json({ code: 400, message: "title, body is required" });
    }
  }
);
app.patch(
  "/api/editNotification",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      Notification.findOneAndUpdate({ _id }, { ...req.body }, { new: true })
        .then((dbRes) => {
          if (dbRes) {
            res.json({ code: "ok", notification: dbRes });
          } else {
            res.json({ code: 400, message: "Notification does not exist." });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "Database error." });
        });
    } else {
      res.status(400).json({ code: 400, message: "Valid _id is required" });
    }
  }
);
app.delete(
  "/api/deleteNotification",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      Notification.findOneAndDelete({ _id })
        .then((dbRes) => {
          if (dbRes) {
            res.json({ code: "ok", notification: dbRes });
          } else {
            res.json({ code: 400, message: "Notification does not exist." });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "Database error." });
        });
    } else {
      res.status(400).json({ code: 400, message: "Valid _id is required" });
    }
  }
);

app.put(
  "/api/pushNotificaiton",
  passport.authenticate("adminPrivate"),
  async (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      const notification = await Notification.findOne({ _id });
      User.aggregate([{ $project: { _id: 1 } }]).then((users) => {
        users.forEach((user, i) => {
          notify(user._id, JSON.stringify({ ...notification._doc }), "User");
        });
        Notification.findOneAndUpdate(
          { _id },
          { $inc: { pushed: 1 } },
          { new: true }
        ).then((value) => {});
        res.json({ code: "ok", message: "notification has been pushed" });
      });
    } else {
      res.status(400).json({ code: 400, message: "Valid _id is required" });
    }
  }
);
