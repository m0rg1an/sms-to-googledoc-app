function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Extract post data
    var rawData = e.postData.contents;
    var contentType = e.postData.type;

    // Check content type
    if (contentType.indexOf("application/x-www-form-urlencoded") === -1) {
      throw new Error("Expected application/x-www-form-urlencoded, got: " + contentType);
    }

    if (!rawData || typeof rawData !== "string") {
      throw new Error("Invalid raw data: " + rawData);
    }

    // Parse URL-encoded data
    var params = {};
    rawData.split("&").forEach(function(pair) {
      var keyValue = pair.split("=");
      if (keyValue.length >= 1) {
        var key = decodeURIComponent(keyValue[0]);
        var value = keyValue.length > 1 ? decodeURIComponent(keyValue[1].replace(/\+/g, " ")) : "";
        params[key] = value;
      }
    });

    // Extract body and to fields
    var body = params.Body || "No message";
    var to = params.To || "Unknown";
    var data=parseDate(body)
    var date=new Date()
    insertParsedData(data,date)

    // Log date, body, and to to sheet
    sheet.appendRow([new Date(), body, to,data.before,data.after]);
    // insertParsedData(body,to)

    // Return TwiML
    var twiml = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    return ContentService.createTextOutput(twiml)
      .setMimeType(ContentService.MimeType.XML);
  } catch (error) {
    // Log error with date
    sheet.appendRow([new Date(), "Error: " + error.toString(), "N/A"]);
    var twiml = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    return ContentService.createTextOutput(twiml)
      .setMimeType(ContentService.MimeType.XML);
  }
}

function parseDate(data) {
  

  if (data.includes("#")) {
    var parts = data.split("#");
    var beforeHash = parts[0].trim(); 
    var afterHash = parts[1].trim(); 

    Logger.log("Before #: " + beforeHash);
    Logger.log("After #: " + afterHash);

    return { before: beforeHash, after: afterHash };
  } else {
    Logger.log("No '#' found in the text.");
    return { before: data.trim(), after: "" };
  }
}

function insertParsedData(data,date) {
  // var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // var lastRow = sheet.getLastRow();
  // var data = sheet.getRange(lastRow, 2).getValue();
  // var date = sheet.getRange(lastRow, 1).getValue(); 
  
  
  var hashtag = data.after;
  var contentToAdd = data.before;

  // Store parsed data in columns D & E
  // sheet.getRange(lastRow, 4).setValue(parsedData.before);
  // sheet.getRange(lastRow, 5).setValue(parsedData.after);

  if (!hashtag) {
    Logger.log("No hashtag found, skipping document creation.");
    return;
  }

 var folderId = "1420ii19EEl9h6FRyYwrZLQJjlSVr9xJI"; 
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByName(hashtag);
  
  var doc;
  if (files.hasNext()) {
    doc = DocumentApp.openById(files.next().getId()); 
  } else {
    doc = DocumentApp.create(hashtag); 
    var file = DriveApp.getFileById(doc.getId());
    folder.addFile(file); 
    DriveApp.getRootFolder().removeFile(file); 
  }

  var body = doc.getBody();
  var sheetDate = new Date(date); // Convert from Google Sheets format
  var formattedSheetDate = Utilities.formatDate(sheetDate, Session.getScriptTimeZone(), "M/d/yyyy"); // Example: "2/23/2025"

  // Check if the date already exists in the document
  var paragraphs = body.getParagraphs();
  var dateExists = false;
  var insertIndex = 0; // Default to inserting at the top

  for (var i = 0; i < paragraphs.length; i++) {
    var text = paragraphs[i].getText().trim();
    if (text === formattedSheetDate) {
      dateExists = true;
      insertIndex = i + 1; // Insert under the found date
      break;
    }
  }

  if (dateExists) {
    // If date exists, add content as a bullet point under the date
    body.insertListItem(insertIndex, contentToAdd).setGlyphType(DocumentApp.GlyphType.BULLET);
  } else {
    // If new date, insert at the very top
    body.insertParagraph(0, "").setHeading(DocumentApp.ParagraphHeading.HEADING2); // Creates space at the top
    body.insertParagraph(0, formattedSheetDate).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.insertListItem(1, contentToAdd).setGlyphType(DocumentApp.GlyphType.BULLET);
  }

  doc.saveAndClose();
  Logger.log("Data inserted into Google Doc: " + hashtag);
}


