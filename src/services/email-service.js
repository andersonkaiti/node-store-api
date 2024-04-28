'use strict';

// process.loadEnvFile(".env");
require("dotenv").config();
const sendgrid = require("sendgrid")(process.env.sendgridKey);

exports.send = async(to, subject, body) => {
    sendgrid.send({
        to: to,
        from: "hello@balta.io",
        subject: subject,
        html: body
    });
}