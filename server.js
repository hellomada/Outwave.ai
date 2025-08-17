import express from "express";
import { google } from "googleapis";

const app = express();
app.use(express.json());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Google OAuth login
app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });
  res.redirect(url);
});

// Step 2: OAuth callback
app.get("/oauth2/callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // TODO: Save tokens.refresh_token in DB
  res.json({
    message: "Authentication successful!",
    tokens
  });
});

// Step 3: Send email (using stored refresh token)
app.post("/send", async (req, res) => {
  try {
    const { refreshToken, to, subject, body } = req.body;
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ];
    const encodedMessage = Buffer.from(messageParts.join("\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(8080, () => console.log("Backend running on port 8080"));
