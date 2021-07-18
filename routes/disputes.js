app.get("/api/disputes", passport.authenticate("adminPrivate"), (req, res) => {
  const { status, page, perPage } = req.query;
  const query = {
    ...(status && { status }),
  };
  Dispute.aggregate([
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
      res.json(dbRes[0]);
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
    if (_id) {
      Dispute.findOne({ _id: req.query._id })
        .populate("milestoneId")
        .then((dbRes) => {
          res.json({ code: "ok", dispute: dbRes });
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
        status: "inProgress",
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
      if (!dispute) {
        res.status(400).json({ code: 400, message: "dispute does not exist" });
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
                      text: `${winner.firstName} winned a dispute.`,
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
          message: "loser balance is low, can't refund milestone.",
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
