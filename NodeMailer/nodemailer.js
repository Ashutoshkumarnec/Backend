var nodemailer = require("nodemailer");
module.exports = {
  Sendsmail: function(data, data1, token, type) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "priya16nec@gmail.com",
          pass: "Ashutosh)(*&^%$#@!~+_"
        }
      });
      var mailOptions = {
        from: '"Account Verification"<priya16nec@gmail.com>',
        to: data,
        subject: "Email Verification",
        // text: "Otp :" + otp
        html:
          "<a href=http://192.168.100.143:3001/Login?id=" +
          data1 +
          ">Click here to verify</a>"
      };
      var mailOptions1 = {
        from: '"Account Verification"<priya16nec@gmail.com>',
        to: data,
        subject: "Email Verification ",
        // text: "Otp :" + otp
        html:
          "<a href=http://192.168.100.143:3001/Reset?id=" +
          data1 +
          "&token=" +
          token +
          ">Click here to verify, it will expire soon</a>"
      };
      if (type === "passwordreset") {
        transporter.sendMail(mailOptions1, function(error, info) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      } else {
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      }
    });
  }
};
