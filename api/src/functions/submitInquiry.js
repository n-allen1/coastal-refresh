const { app } = require("@azure/functions");
const sgMail = require("@sendgrid/mail");

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "goingcoastalrefresh@gmail.com";
const REQUIRED_FIELDS = ["firstName", "lastName", "email", "message"];

// Generous ceilings on the *raw* input, checked before any regex work, so a
// pathologically huge request body can't make the sanitizers do needless work.
const RAW_MAX_LENGTHS = {
  firstName: 500,
  lastName: 500,
  email: 500,
  phone: 100,
  message: 10000,
};

// Limits enforced on the sanitized value that actually gets emailed.
const MAX_LENGTHS = {
  firstName: 80,
  lastName: 80,
  email: 254,
  message: 500,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Letters (incl. common accented Latin ones), plus the handful of
// characters real names use: apostrophe, period, space, hyphen. No digits
// or other symbols.
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]+$/;
const INVALID_PHONE = Symbol("invalid-phone");

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

    if (!withinRawLimits(data)) {
      return respond(isJson, 400, "One or more fields are too long.");
    }

    const fields = {
      firstName: sanitizeSingleLine(data.firstName, MAX_LENGTHS.firstName),
      lastName: sanitizeSingleLine(data.lastName, MAX_LENGTHS.lastName),
      email: sanitizeSingleLine(data.email, MAX_LENGTHS.email),
      phone: normalizePhone(data.phone),
      message: sanitizeMessage(data.message, MAX_LENGTHS.message),
    };

    const missing = REQUIRED_FIELDS.filter((field) => !fields[field]);
    if (missing.length > 0) {
      return respond(isJson, 400, "Please fill out all required fields.");
    }

    if (!NAME_PATTERN.test(fields.firstName) || !NAME_PATTERN.test(fields.lastName)) {
      return respond(isJson, 400, "Names can only contain letters.");
    }

    if (!EMAIL_PATTERN.test(fields.email)) {
      return respond(isJson, 400, "Please enter a valid email address.");
    }

    if (fields.phone === INVALID_PHONE) {
      return respond(isJson, 400, "Please enter a valid 10-digit US phone number.");
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

function withinRawLimits(data) {
  return Object.keys(RAW_MAX_LENGTHS).every((field) => {
    const value = data[field];
    return typeof value !== "string" || value.length <= RAW_MAX_LENGTHS[field];
  });
}

// Strips control characters (including CR/LF) so a field can never inject
// extra email headers or break out of the single line it belongs on.
function sanitizeSingleLine(raw, maxLength) {
  const value = typeof raw === "string" ? raw : "";
  return value
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Same idea, but the message is allowed real line breaks - only stray
// control characters (not plain \n/\t) are stripped.
function sanitizeMessage(raw, maxLength) {
  const value = typeof raw === "string" ? raw : "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Optional field. Accepts any reasonable US phone formatting the visitor
// (or the client-side mask) might send, and always normalizes to the same
// "+1 XXX-XXX-XXXX" shape for the email - or INVALID_PHONE if what's left
// isn't a real 10-digit US number.
function normalizePhone(raw) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) {
    return "";
  }
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.charAt(0) === "1") {
    digits = digits.slice(1);
  }
  if (digits.length !== 10) {
    return INVALID_PHONE;
  }
  return `+1 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

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
