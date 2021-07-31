app.get("/api/disputes", passport.authenticate("adminPrivate"), (req, res) => {
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
  Dispute.aggregate([
    {
      $lookup: {
        from: "users",
        let: {
          plaintiff: "$plaintiff._id",
        },
        as: "plainProfile",
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$plaintiff"] } } },
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
          defendant: "$defendant._id",
        },
        as: "defProfile",
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$defendant"] } } },
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
        plaintiff: {
          $mergeObjects: [
            "$plaintiff",
            {
              $first: "$plainProfile",
            },
          ],
        },
        defendant: {
          $mergeObjects: [
            "$defendant",
            {
              $first: "$defProfile",
            },
          ],
        },
      },
    },
    { $unset: ["plainProfile", "defProfile"] },
    {
      $match: query,
    },
    {
      $lookup: {
        from: "milestones",
        localField: "milestoneId",
        foreignField: "_id",
        as: "milestoneId",
      },
    },
    {
      $set: {
        milestoneId: {
          $first: "$milestoneId",
        },
      },
    },
    {
      $set: {
        "plaintiff.role": {
          $cond: {
            if: {
              $eq: ["$milestoneId.seller._id", "$plaintiff._id"],
            },
            then: "seller",
            else: "buyer",
          },
        },
        "defendant.role": {
          $cond: {
            if: {
              $eq: ["$milestoneId.seller._id", "$defendant._id"],
            },
            then: "seller",
            else: "buyer",
          },
        },
      },
    },
    { $sort: sortOrder },
    {
      $facet: {
        disputes: [
          { $skip: +perPage * (+(page || 1) - 1) },
          { $limit: +(perPage || 20) },
        ],
        pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
      },
    },
  ])
    .then((dbRes) => {
      res.json({ code: "ok", disputes: dbRes[0] });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ code: 500, message: "something went wrong" });
    });
});
app.get(
  "/api/singleDispute",
  passport.authenticate("adminPrivate"),
  (req, res) => {
    const { _id } = req.query;
    if (ObjectId.isValid(_id)) {
      Dispute.aggregate([
        {
          $match: {
            _id: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              plaintiff: "$plaintiff._id",
            },
            as: "plainProfile",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$plaintiff"],
                  },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  phone: 1,
                  email: 1,
                  profileImg: 1,
                  balance: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              defendant: "$defendant._id",
            },
            as: "defProfile",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$defendant"],
                  },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  phone: 1,
                  email: 1,
                  profileImg: 1,
                  balance: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "milestones",
            localField: "milestoneId",
            foreignField: "_id",
            as: "milestone",
          },
        },
        {
          $set: {
            plaintiff: {
              $mergeObjects: [
                "$plaintiff",
                {
                  $first: "$plainProfile",
                },
              ],
            },
            defendant: {
              $mergeObjects: [
                "$defendant",
                {
                  $first: "$defProfile",
                },
              ],
            },
            milestone: {
              $first: "$milestone",
            },
          },
        },
        {
          $unset: ["plainProfile", "defProfile", "milestoneId"],
        },
        {
          $set: {
            "plaintiff.role": {
              $cond: {
                if: {
                  $eq: ["$milestone.seller._id", "$plaintiff._id"],
                },
                then: "seller",
                else: "buyer",
              },
            },
            "defendant.role": {
              $cond: {
                if: {
                  $eq: ["$milestone.seller._id", "$defendant._id"],
                },
                then: "seller",
                else: "buyer",
              },
            },
          },
        },
      ]).then(async (dbRes) => {
        if (dbRes.length) {
          const [dispute] = dbRes;
          const chat = await Chat.findOne({
            $or: [
              {
                user: dispute.plaintiff._id,
                client: dispute.defendant._id,
              },
              {
                client: dispute.plaintiff._id,
                user: dispute.defendant._id,
              },
            ],
          });
          res.json({ code: "ok", dispute, chat });
        } else {
          res.json({ code: 400, message: "Dispute could not be found" });
        }
      });
    } else {
      res
        .status(400)
        .json({ code: 400, message: "_id is required in query parameter" });
    }
  }
);
app.patch(
  "/api/resolveDispute",
  passport.authenticate("adminPrivate"),
  async (req, res) => {
    let { _id, winner } = req.body;
    if (_id && winner) {
      const [dispute, milestone, plaintiff, defendant] = await Dispute.findOne({
        _id,
        status: "pendingVerdict",
      })
        .populate("milestoneId", "buyer seller amount")
        .then(async (dispute) => {
          if (dispute) {
            const [plaintiff, defendant] = await Promise.all([
              User.findOne(
                { _id: dispute.plaintiff._id },
                "balance firstName lastName phone"
              ),
              User.findOne(
                { _id: dispute.defendant._id },
                "balance firstName lastName phone"
              ),
            ]);
            const milestone = dispute.milestoneId;
            return [dispute, milestone, plaintiff, defendant];
          } else {
            return [];
          }
        });
      if (!dispute || !milestone || !plaintiff || !defendant) {
        res.status(400).json({
          code: 400,
          message:
            "1 of Dispute, Milestone, Plaintiff, Defendant does not exist",
        });
        return;
      }
      const loser = plaintiff._id.toString() !== winner ? plaintiff : defendant;
      const winnerDetail =
        plaintiff._id.toString() === winner ? plaintiff : defendant;
      const disputeForRefund = dispute.plaintiff._id === milestone.buyer._id;
      const buyerWins = milestone.buyer._id.toString() === winner;
      const sellerWins = milestone.seller._id.toString() === winner;
      if (loser.balance > milestone.amount) {
        Promise.all([
          new Transaction({
            user: winner,
            amount: 500,
            note: "dispute resolve",
          })
            .save()
            .then((transaction) =>
              transaction
                ? User.findOneAndUpdate(
                    { _id: winner },
                    {
                      $inc: { balance: transaction.amount },
                      $addToSet: { transactions: transaction._id },
                    },
                    { new: true }
                  ).then((user) => (user ? transaction : null))
                : null
            ),
          ...(disputeForRefund && buyerWins
            ? [
                new P2PTransaction({
                  user: winner,
                  milestoneId: milestone._id,
                  amount: milestone.amount,
                  client: {
                    _id: loser._id,
                    firstName: loser.firstName,
                    lastName: loser.lastName,
                    phone: loser.phone,
                    email: loser.email,
                  },
                  note: "milestone refund",
                })
                  .save()
                  .then((transaction) =>
                    transaction
                      ? User.findOneAndUpdate(
                          { _id: winner },
                          {
                            $inc: { balance: transaction.amount },
                            $addToSet: { transactions: transaction._id },
                          },
                          { new: true }
                        )
                      : null
                  ),
                new P2PTransaction({
                  user: loser._id,
                  milestoneId: milestone._id,
                  amount: -milestone.amount,
                  client: {
                    _id: winner,
                    firstName: winnerDetail.firstName,
                    lastName: winnerDetail.lastName,
                    phone: winnerDetail.phone,
                    email: winnerDetail.email,
                  },
                  note: "milestone refund",
                })
                  .save()
                  .then((transaction) =>
                    transaction
                      ? User.findOneAndUpdate(
                          { _id: loser._id },
                          {
                            $inc: { balance: -transaction.amount },
                            $addToSet: { transactions: transaction._id },
                          },
                          { new: true }
                        )
                      : null
                  ),
              ]
            : []),
          ...(!disputeForRefund && sellerWins
            ? [
                new P2PTransaction({
                  user: winner,
                  milestoneId: milestone._id,
                  amount: milestone.amount,
                  client: {
                    _id: loser._id,
                    firstName: loser.firstName,
                    lastName: loser.lastName,
                    phone: loser.phone,
                    email: loser.email,
                  },
                  note: "milestone refund",
                })
                  .save()
                  .then((transaction) =>
                    transaction
                      ? User.findOneAndUpdate(
                          { _id: winner },
                          {
                            $inc: { balance: transaction.amount },
                            $addToSet: { transactions: transaction._id },
                          },
                          { new: true }
                        )
                      : null
                  ),
              ]
            : []),
          ...(!disputeForRefund && buyerWins
            ? [
                new P2PTransaction({
                  user: winner,
                  milestoneId: milestone._id,
                  amount: milestone.amount,
                  client: {
                    _id: loser._id,
                    firstName: loser.firstName,
                    lastName: loser.lastName,
                    phone: loser.phone,
                    email: loser.email,
                  },
                  note: "milestone refund",
                })
                  .save()
                  .then((transaction) =>
                    transaction
                      ? User.findOneAndUpdate(
                          { _id: winner },
                          {
                            $inc: { balance: transaction.amount },
                            $addToSet: { transactions: transaction._id },
                          },
                          { new: true }
                        )
                      : null
                  ),
              ]
            : []),
        ]).then((dbRes) => {
          if (dbRes[0]) {
            Dispute.findOneAndUpdate(
              { _id },
              {
                status: "resolved",
                winner,
              },
              { new: true }
            ).then((dispute) => {
              InitiateChat({
                user: winnerDetail._id,
                client: loser._id,
              })
                .then(([userChat, clientChat]) => {
                  return SendMessage({
                    rooms: [userChat._id, clientChat._id],
                    message: {
                      type: "dispute",
                      from: winnerDetail._id,
                      to: loser._id,
                      text: `${winnerDetail.firstName} winned a dispute.`,
                    },
                  });
                })
                .then((chatRes) => {
                  notify(
                    winner._id,
                    JSON.stringify({
                      title: "Dispute result",
                      body: `You winned a dispute.`,
                    }),
                    "User"
                  );
                  notify(
                    loser._id,
                    JSON.stringify({
                      title: "Dispute result",
                      body: `You lost a dispute.`,
                    }),
                    "User"
                  );
                });
              res.json({ code: "ok", message: "dispute resolved", dispute });
            });
          } else {
            res
              .status(500)
              .json({ code: 500, message: "could not resolve dispute" });
          }
        });
      } else {
        res.json({
          code: 400,
          message: "loser's balance is low, can't refund milestone.",
        });
      }
    } else {
      res.status(400).json({
        code: 400,
        message: "_id and winner is required",
        fieldsFound: req.body,
      });
    }
  }
);
