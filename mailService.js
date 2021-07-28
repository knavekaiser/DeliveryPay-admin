const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "mail.deliverypay.in",
  port: 465,
  secure: true,
  auth: {
    user: "support@deliverypay.in",
    pass: process.env.SUPPORT_MAIL_PASS,
  },
});

global.sendEmail = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      let info = await transporter.sendMail({
        from: {
          name: "Delivery Pay",
          address: "support@deliverypay.com",
        },
        ...message,
      });
      info.success = !!info.accepted?.length;
      resolve(info);
    } catch (err) {
      reject(err);
    }
  });
};
