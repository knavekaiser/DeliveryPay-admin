global.InitiateChat = async ({ user, client }) => {
  return Promise.all([
    new Chat({ user, client }).save().catch((err) => {
      if (err.code === 11000) {
        return Chat.findOne({ user, client });
      }
    }),
    new Chat({ user: client, client: user }).save().catch((err) => {
      if (err.code === 11000) {
        return Chat.findOne({ user: client, client: user });
      }
    }),
  ]);
};
global.SendMessage = async ({ rooms, message }) => {
  io.to(rooms[0].toString())
    .to(rooms[1].toString())
    .emit("messageToUser", {
      type: "milestone",
      ...message,
    });
  return Chat.updateMany(
    { $or: rooms.map((room) => ({ _id: room })) },
    { $push: { messages: message } }
  );
};
