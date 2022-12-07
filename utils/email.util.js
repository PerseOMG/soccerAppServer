const nodemailer = require("nodemailer");
// GMAIL
// service: 'Gmail',
// auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
// }
// Activate in gmail "less secure app" option

const sendEmail = async(options) => {
    console.log(options);
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "15ab6820a53d5d",
            pass: "441bb4e74eb6b2",
        },
    });

    const mailOptions = {
        from: "Daniel Muñoz <daniel@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // html:

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;