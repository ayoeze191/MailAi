import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "ayoeze191@gmail.com",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(
      "./../../mail-template/build_production/templates"
    ),
    defaultLayout: false,
  },
  viewPath: path.resolve("./templates/emails"),
};

transporter.use("compile", hbs(handlebarOptions));

export const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: mailOptions.sender,
      to: mailOptions.reciever,
      subject: mailOptions.subject,
      html: "<b>Hello world?</b>", // HTML body
    });
  } catch (err) {
    console.log(err, "ERROR");
  }
};
