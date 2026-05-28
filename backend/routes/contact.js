import "dotenv/config";
import express from "express";
import Message from "../models/Message.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure the nodemailer transporter using explicit Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer SMTP Connection Error:", error);
  } else {
    console.log("Nodemailer SMTP Server is ready to send messages");
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required." });
    }

    // 1. Save to the Database immediately
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // 2. Trigger automatic email notification inside a safe try-catch
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // sends the notification to yourself
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new message from your portfolio website:

Name: ${name}
Email: ${email}
Message: ${message}`,
      html: `
        <h3>New Portfolio Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Nodemailer failed to send email notification:", mailError);
    }

    // Return successful response to the visitor
    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Unable to save message." });
  }
});

export default router;
