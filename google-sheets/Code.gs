/**
 * Dreamweave Digital — form submissions logger.
 *
 * Paste this into Extensions → Apps Script on the destination Google Sheet, then deploy as a
 * Web App (Execute as: Me, Who has access: Anyone). See README.md in this folder for the full
 * setup and the frontend side of this integration.
 *
 * Security model: this script can only append a row, in a shape it defines itself, to one of a
 * fixed set of tabs. It never reads back arbitrary data and never exposes anything beyond
 * "submission accepted or not." The Web App URL is not treated as a secret — see README.md.
 */

// Column order is defined here, not trusted from the request, so a malformed/crafted payload
// can never shuffle which value lands in which column.
var SHEET_SCHEMAS = {
  Contact: {
    required: ["name", "email", "message"],
    columns: ["name", "email", "phone", "message"],
  },
  Apply: {
    required: ["name", "city", "whatsapp", "instagram"],
    columns: ["name", "city", "whatsapp", "instagram", "followers", "category", "portfolio", "mediakit"],
  },
  BookCampaign: {
    required: ["business", "industry"],
    columns: ["business", "industry", "budget", "goal", "location", "timeline"],
  },
  Newsletter: {
    required: ["email"],
    columns: ["email"],
  },
};

var MAX_FIELD_LENGTH = 2000;

function doPost(e) {
  try {
    var body = parseBody_(e);
    var sheetName = body.sheet;
    var data = body.data || {};

    var schema = SHEET_SCHEMAS[sheetName];
    if (!schema) {
      return jsonOutput_({ ok: false, error: "Unknown sheet." });
    }

    for (var i = 0; i < schema.required.length; i++) {
      var field = schema.required[i];
      if (!data[field] || String(data[field]).trim() === "") {
        return jsonOutput_({ ok: false, error: "Missing required field: " + field });
      }
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return jsonOutput_({ ok: false, error: "Sheet tab not found: " + sheetName });
    }

    var row = [new Date()];
    for (var j = 0; j < schema.columns.length; j++) {
      var value = data[schema.columns[j]];
      row.push(clean_(value));
    }

    sheet.appendRow(row);
    return jsonOutput_({ ok: true });
  } catch (err) {
    // Never let a raw error/stack trace escape — log it for yourself (View → Executions in the
    // Apps Script editor) and return a generic message.
    console.error(err);
    return jsonOutput_({ ok: false, error: "Unexpected error." });
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Empty request body.");
  }
  return JSON.parse(e.postData.contents);
}

function clean_(value) {
  if (value === undefined || value === null) return "";
  var str = String(value).trim();
  return str.length > MAX_FIELD_LENGTH ? str.slice(0, MAX_FIELD_LENGTH) : str;
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
