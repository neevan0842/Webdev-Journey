// Looking to send emails in production? Check out our Email API/SMTP product!
import { MailtrapTransport } from "mailtrap";
import Nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async (
  email: string,
  emailType: string,
  userId: string
) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const sender = {
      address: "hello@example.com",
      name: "Mailtrap Test",
    };
    const TOKEN = process.env.MAILTRAP_TOKEN!;
    const transport = Nodemailer.createTransport(
      MailtrapTransport({
        token: TOKEN,
        testInboxId: 3411836,
      })
    );

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const mailresponse = await transport
      .sendMail({
        from: sender,
        to: [email],
        subject:
          emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${
          process.env.DOMAIN! || "http://localhost:3000"
        }/verifyemail?token=${hashedToken}">here</a> to ${
          emailType === "VERIFY" ? "verify your email" : "reset your password"
        }</p> <br> <p><b>Or copy and paste the link below in your browser</b></p> <p><b>${
          process.env.DOMAIN! || "http://localhost:3000"
        }/verifyemail?token=${hashedToken}</b></p>`,

        category: "Integration Test",
        sandbox: true,
      })
      .then(console.log, console.error);
    return mailresponse;
  } catch (error: any) {
    console.log(error.message + "error");
  }
};
