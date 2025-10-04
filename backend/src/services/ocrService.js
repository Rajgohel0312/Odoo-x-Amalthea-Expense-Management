// services/ocrService.js
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

// Simple regex helpers
function extractAmount(text) {
  const match = text.match(/(\d+[.,]?\d{0,2})/g);
  if (!match) return null;
  return parseFloat(match.pop().replace(",", "."));
}

function extractCurrency(text) {
  const currencies = ["INR", "USD", "EUR", "GBP", "₹", "$", "€", "£"];
  const found = currencies.find((c) => text.includes(c));
  if (!found) return "INR"; // default
  return found.replace(/[^A-Z]/g, "") || "INR";
}

function extractDate(text) {
  const match = text.match(
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/
  );
  return match ? match[0] : null;
}

function extractDescription(text) {
  const keywords = ["Invoice", "Receipt", "Bill", "Hotel", "Restaurant"];
  const found = keywords.find((k) => text.toLowerCase().includes(k.toLowerCase()));
  return found || "Expense Receipt";
}

async function parseReceipt(filePath) {
  try {
    const { data } = await Tesseract.recognize(filePath, "eng");
    const text = data.text;

    const parsed = {
      amount: extractAmount(text),
      currency: extractCurrency(text),
      date: extractDate(text),
      description: extractDescription(text),
      merchant: "Detected Receipt",
    };

    // delete temp file
    fs.unlinkSync(filePath);

    return parsed;
  } catch (err) {
    console.error("OCR parse error:", err);
    throw new Error("OCR parsing failed");
  }
}

module.exports = { parseReceipt };
