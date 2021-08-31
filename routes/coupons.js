app.get("/api/coupons", passport.authenticate("adminPrivate"), (req, res) => {
  const { q, page, perPage, sort, order } = req.query;
  const query = {
    ...(q && {
      $or: [{ title: new RegExp(q, "gi") }, { body: new RegExp(q, "gi") }],
    }),
  };
  const sortOrder = {
    [sort || "createdAt"]: order === "asc" ? 1 : -1,
  };
  Coupon.aggregate([
    { $match: query },
    { $sort: sortOrder },
    {
      $facet: {
        coupons: [
          { $skip: +perPage * (+(page || 1) - 1) },
          { $limit: +(perPage || 20) },
        ],
        total: [{ $group: { _id: null, count: { $sum: 1 } } }],
      },
    },
    { $set: { total: { $first: "$total.count" } } },
  ])
    .then(([{ coupons, total }]) => {
      res.json({ code: "ok", coupons, total });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ code: 500, message: "something went wrong" });
    });
});

app.post(
  "/api/addCoupon",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { code, type, amount, maxDiscount, threshold, date } = req.body;
    if (
      code &&
      type &&
      amount &&
      maxDiscount &&
      threshold &&
      date?.from &&
      date?.to
    ) {
      new Coupon({ ...req.body })
        .save()
        .then((dbRes) => {
          res.json({ code: "ok", coupon: dbRes });
          Product.aggregate([{ $group: { _id: "$user" } }]).then((sellers) => {
            sellers.forEach((seller, i) => {
              notify(
                seller._id,
                JSON.stringify({
                  title: "New Campaign!",
                  body:
                    "A new Campaign has started. be a part of the campaign now.",
                  link: `/account/myShop/campaigns`,
                  ...(dbRes.image && { image: dbRes.image }),
                }),
                "User"
              );
            });
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res
              .status(409)
              .json({ code: 409, message: "Code already exists." });
          } else {
            console.log(err);
            res.status(500).json({ code: 500, message: "Database error." });
          }
        });
    } else {
      res.status(400).json({
        code: 400,
        feildsFound: req.body,
        message: "code, type, amount, maxDiscount, threshold, date is required",
      });
    }
  }
);
app.patch(
  "/api/editCoupon",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      Coupon.findOneAndUpdate({ _id }, { ...req.body }, { new: true })
        .then((dbRes) => {
          if (dbRes) {
            res.json({ code: "ok", coupon: dbRes });
          } else {
            res.json({ code: 400, message: "Coupon does not exist." });
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
  "/api/deleteCoupon",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.body;
    if (ObjectId.isValid(_id)) {
      Coupon.findOneAndDelete({ _id })
        .then((dbRes) => {
          if (dbRes) {
            res.json({ code: "ok", coupon: dbRes });
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
