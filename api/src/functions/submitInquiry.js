const { app } = require("@azure/functions");
const sgMail = require("@sendgrid/mail");

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "goingcoastalrefresh@gmail.com";
const REQUIRED_FIELDS = ["firstName", "lastName", "email", "message"];

app.http("submitInquiry", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "submit-inquiry",
  handler: async (request, context) => {
    const contentType = request.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let data;
    try {
      data = isJson
        ? await request.json()
        : Object.fromEntries(new URLSearchParams(await request.text()));
    } catch (err) {
      context.error("Failed to parse inquiry form body", err);
      return respond(isJson, 400, "Invalid form submission.");
    }

    const fields = {
      firstName: (data.firstName || "").trim(),
      lastName: (data.lastName || "").trim(),
      email: (data.email || "").trim(),
      phone: (data.phone || "").trim(),
      message: (data.message || "").trim(),
    };

    const missing = REQUIRED_FIELDS.filter((field) => !fields[field]);
    if (missing.length > 0) {
      return respond(isJson, 400, "Please fill out all required fields.");
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      context.error("SENDGRID_API_KEY or CONTACT_FROM_EMAIL is not configured.");
      return respond(isJson, 500, "Email service is not configured.");
    }
    sgMail.setApiKey(apiKey);

    try {
      await sgMail.send({
        to: TO_EMAIL,
        from: fromEmail,
        replyTo: fields.email,
        subject: `New inquiry from ${fields.firstName} ${fields.lastName}`,
        text: [
          `Name: ${fields.firstName} ${fields.lastName}`,
          `Email: ${fields.email}`,
          `Phone: ${fields.phone || "(not provided)"}`,
          "",
          fields.message,
        ].join("\n"),
      });
    } catch (err) {
      context.error("SendGrid send failed", err);
      return respond(isJson, 502, "Could not send your message. Please try again or email us directly.");
    }

    return respond(isJson, 200, null, true);
  },
});

function respond(isJson, status, errorMessage, sent) {
  if (isJson) {
    return {
      status,
      jsonBody: errorMessage ? { error: errorMessage } : { ok: true },
    };
  }
  return {
    status: 303,
    headers: { Location: `/?sent=${sent ? "1" : "0"}#contact` },
  };
}
