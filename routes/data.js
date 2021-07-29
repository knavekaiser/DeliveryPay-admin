app.get(
  "/api/getDashboardData",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const thisMonth = {
      start: new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
      end: new Date(
        new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(1)
      ).setHours(0, 0, 0, 0),
    };
    Promise.all([
      User.aggregate([
        { $match: { active: true } },
        { $group: { _id: null, balance: { $sum: "$balance" } } },
      ]),
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("user", "firstName lastName phone email profileImg"),
      Milestone.find({ status: "inProgress" }).countDocuments(),
      Dispute.find({ status: "pendingVerdict" }).countDocuments(),
      Transaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(thisMonth.start),
              $lt: new Date(thisMonth.end),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ])
      .then(
        ([
          totalBalance,
          recentTrans,
          activeMilestones,
          activeDisputes,
          transactionThisMonth,
        ]) => {
          res.json({
            code: "ok",
            totalBalance: totalBalance[0].balance,
            recentTrans,
            activeMilestones,
            activeDisputes,
            transactionThisMonth: transactionThisMonth[0].total,
          });
        }
      )
      .catch((err) => {
        res.status(500).json({ code: 500, message: "someting went wrong" });
      });
  }
);
app.get(
  "/api/transactions",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { page, perPage, sort, order, q, dateFrom, dateTo } = req.query;
    const sortOrder = {
      [sort || "createdAt"]: order === "asc" ? 1 : -1,
    };
    const query = {
      ...(q && {
        $or: [
          { "user.firstName": new RegExp(q, "gi") },
          { "user.phone": new RegExp(q, "gi") },
          { note: new RegExp(q, "gi") },
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
    Transaction.aggregate([
      {
        $lookup: {
          from: "users",
          as: "user",
          let: {
            userId: "$user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userId"],
                },
              },
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImg: 1,
                phone: 1,
                email: 1,
              },
            },
          ],
        },
      },
      { $set: { user: { $first: "$user" } } },
      { $match: query },
      { $sort: sortOrder },
      {
        $facet: {
          transactions: [
            { $skip: +perPage * (+(page || 1) - 1) },
            { $limit: +(perPage || 20) },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((dbRes) => {
        res.json({ code: "ok", transactions: dbRes[0] });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "database error" });
      });
  }
);

app.get(
  "/api/milestones",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const {
      page,
      perPage,
      sort,
      order,
      q,
      dateFrom,
      dateTo,
      status,
    } = req.query;
    const sortOrder = {
      [sort || "createdAt"]: order === "asc" ? 1 : -1,
    };
    const query = {
      ...(q && {
        $or: [
          { "seller.firstName": new RegExp(q, "gi") },
          { "seller.phone": new RegExp(q, "gi") },
          { "buyer.firstName": new RegExp(q, "gi") },
          { "buyer.phone": new RegExp(q, "gi") },
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
      ...(status && { status }),
    };
    Milestone.aggregate([
      {
        $lookup: {
          from: "users",
          let: {
            buyer: "$buyer._id",
          },
          as: "buyerProfile",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$buyer"] } } },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                phone: 1,
                email: 1,
                profileImg: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            seller: "$seller._id",
          },
          as: "sellerProfile",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$seller"] } } },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                phone: 1,
                email: 1,
                profileImg: 1,
              },
            },
          ],
        },
      },
      {
        $set: {
          seller: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: "$sellerProfile",
                  },
                  0,
                ],
              },
              then: {
                $first: "$sellerProfile",
              },
              else: "$seller",
            },
          },
          buyer: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: "$buyerProfile",
                  },
                  0,
                ],
              },
              then: {
                $first: "$buyerProfile",
              },
              else: "$buyer",
            },
          },
        },
      },
      {
        $unset: ["buyerProfile", "sellerProfile"],
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $match: query },
      { $sort: sortOrder },
      {
        $facet: {
          milestones: [
            { $skip: +perPage * (+(page || 1) - 1) },
            { $limit: +(perPage || 20) },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ])
      .then((dbRes) => {
        res.json({ code: "ok", milestones: dbRes[0] });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ code: 500, message: "database error" });
      });
  }
);