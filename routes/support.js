app.get("/api/faqs", passport.authenticate("adminPrivate"), (req, res) => {
  const { q, page, perPage, sort, order, dateFrom, dateTo } = req.query;
  const sortOrder = {
    [sort || "createdAt"]: order === "asc" ? 1 : -1,
  };
  const query = {
    ...(q && {
      $or: [{ ans: new RegExp(q, "gi") }, { ques: new RegExp(q, "gi") }],
    }),
    ...(dateFrom &&
      dateTo && {
        createdAt: {
          $gte: new Date(dateFrom),
          $lt: new Date(dateTo),
        },
      }),
  };
  Faq.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "admins",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $set: { author: { $first: "$author" } } },
    { $sort: sortOrder },
    {
      $facet: {
        faqs: [
          { $skip: +perPage * (+(page || 1) - 1) },
          { $limit: +(perPage || 20) },
        ],
        pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
      },
    },
  ])
    .then((dbRes) => {
      res.json({ code: "ok", faqs: dbRes[0] });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ code: 500, message: "database error" });
    });
});
app.post("/api/faq", passport.authenticate("adminPrivate"), (req, res) => {
  const { ans, ques } = req.body;
  if (ans && ques) {
    new Faq({ ans, ques, author: req.user._id })
      .save()
      .then((dbRes) => {
        res.json({
          code: "ok",
          faq: {
            ...dbRes._doc,
            author: {
              name: req.user.name,
              profileImg: req.user.profileImg,
              phone: req.user.phone,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "server error" });
      });
  } else {
    res.status(400).json({
      code: 400,
      message: "ans and ques is required",
      found: req.body,
    });
  }
});
app.patch("/api/faq", passport.authenticate("adminPrivate"), (req, res) => {
  if (req.body._id) {
    Faq.findOneAndUpdate({ _id: req.body._id }, { ...req.body }, { new: true })
      .then((dbRes) => {
        if (dbRes) {
          res.json({
            code: "ok",
            faq: {
              ...dbRes._doc,
              author: {
                name: req.user.name,
                profileImg: req.user.profileImg,
                phone: req.user.phone,
              },
            },
          });
        } else {
          res.status(400).json({ code: 400, message: "faq does not exist." });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "database error" });
      });
  } else {
    res.status(400).json({
      code: 400,
      message: "_id is required",
    });
  }
});
app.delete(
  "/api/deleteFaq",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    if (req.body._id) {
      Faq.findOneAndDelete({ _id: req.body._id })
        .then((dbRes) => {
          if (dbRes) {
            res.json({
              code: "ok",
              message: "successfully deleted",
            });
          } else {
            res.status(400).json({ code: 400, message: "faq does not exist." });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ code: 500, message: "database error" });
        });
    } else {
      res.status(400).json({
        code: 400,
        message: "_id is required",
      });
    }
  }
);

app.get("/api/tickets", passport.authenticate("adminPrivate"), (req, res) => {
  const { status, page, perPage, sort, order, dateFrom, dateTo } = req.query;
  const query = {
    ...(status && { status }),
    ...(dateFrom &&
      dateTo && {
        createdAt: {
          $gte: new Date(dateFrom),
          $lt: new Date(dateTo),
        },
      }),
  };
  const sortOrder = {
    [sort || "createdAt"]: order === "asc" ? 1 : -1,
  };
  Ticket.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "users",
        as: "user",
        localField: "user",
        foreignField: "_id",
      },
    },
    { $set: { user: { $first: "$user" } } },
    { $sort: sortOrder },
    {
      $facet: {
        tickets: [
          { $skip: +perPage * (+(page || 1) - 1) },
          { $limit: +(perPage || 20) },
        ],
        pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
      },
    },
  ])
    .then((dbRes) => {
      res.json({ code: "ok", tickets: dbRes[0] });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).josn({ code: 500, message: "database error" });
    });
});
app.get(
  "/api/singleTicket",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    if (req.query._id && ObjectId.isValid(req.query._id)) {
      Ticket.aggregate([
        {
          $match: { _id: new ObjectId(req.query._id) },
        },
        {
          $lookup: {
            from: "transactions",
            localField: "transaction",
            foreignField: "_id",
            as: "transaction",
          },
        },
        {
          $lookup: {
            from: "milestones",
            localField: "milestone",
            foreignField: "_id",
            as: "milestone",
          },
        },
        {
          $set: {
            transaction: {
              $first: "$transaction",
            },
            milestone: {
              $first: "$milestone",
            },
          },
        },
      ]).then((ticket) => {
        if (ticket.length) {
          res.json({ code: "ok", ticket: ticket[0] });
        } else {
          res
            .status(404)
            .json({ code: 404, message: "ticket could not be found" });
        }
      });
    } else {
      res.status(400).json({ code: 400, message: "valid _id is required" });
    }
  }
);
app.patch(
  "/api/addTicketReply",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    if (req.body._id && ObjectId.isValid(req.body._id) && req.body.message) {
      Ticket.findOneAndUpdate(
        { _id: req.body._id },
        {
          $push: {
            messages: {
              user: {
                name: req.user.name,
                role: "admin",
              },
              message: req.body.message,
            },
          },
        },
        { new: true }
      ).then((dbRes) => {
        if (dbRes) {
          notify(
            dbRes.user,
            JSON.stringify({
              title: "Ticket on Delivery Pay",
              body: "Admin replied on your ticket",
            }),
            "User"
          );
          res.json({ code: "ok", ticket: dbRes });
        } else {
          res
            .status(404)
            .json({ code: 404, message: "Ticket does not exist." });
        }
      });
    } else {
      res
        .status(400)
        .json({ code: 400, message: "valid _id and message is required" });
    }
  }
);

app.get(
  "/api/contactRequest",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { status, page, perPage, sort, order, dateFrom, dateTo } = req.query;
    const query = {
      ...(status && { status }),
      ...(dateFrom &&
        dateTo && {
          createdAt: {
            $gte: new Date(dateFrom),
            $lt: new Date(dateTo),
          },
        }),
    };
    const sortOrder = {
      [sort || "createdAt"]: order === "asc" ? 1 : -1,
    };
    ContactUs.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          as: "user",
          localField: "user",
          foreignField: "_id",
        },
      },
      { $set: { user: { $first: "$user" } } },
      { $sort: sortOrder },
      {
        $facet: {
          contactRequests: [
            { $skip: +perPage * (+(page || 1) - 1) },
            { $limit: +(perPage || 20) },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((dbRes) => {
        res.json({ code: "ok", contactRequests: dbRes[0] });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).josn({ code: 500, message: "database error" });
      });
  }
);
app.delete(
  "/api/deleteContactRequest",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (_id && ObjectId.isValid(_id)) {
      ContactUs.findOneAndDelete({ _id }).then((dbRes) => {
        if (dbRes) {
          res.json({ code: "ok", message: "request successfully deleted." });
        } else {
          res.status(500).json({ code: 500, message: "database error" });
        }
      });
    } else {
      res.status(400).json({ code: 400, message: "valid _id is required" });
    }
  }
);
