# Text2Doc: SMS to Google Docs Automation

Save text messages as notes in a Google Doc with this automated note-taking app. It organizes your notes into separate lists in Google Docs by hashtag.

![Image](https://github.com/user-attachments/assets/92b29074-c314-4200-b485-28a0913b354e)

## Overview
Text2Doc is an automation workflow that enables seamless storage of SMS messages into Google Docs. The process involves receiving text messages via Twilio, forwarding the message payload through a webhook to a Google Apps Script, and systematically storing and organizing the data in Google Sheets and Google Docs.

## Workflow
1. **Receive SMS via Twilio**: A Twilio phone number is set up to receive text messages.
2. **Trigger Webhook**: Twilio forwards the message payload to a configured webhook.
3. **Google Apps Script Webhook**: The webhook is a Google Apps Script that writes the received message into a Google Sheet.
4. **Record Processing**: Another Google Apps Script monitors new entries in the Google Sheet, extracts relevant data, and appends the content to the corresponding Google Doc.

## Prerequisites
- A Twilio account with a phone number enabled for SMS reception.
- Google Apps Script with webhook capabilities.
- A Google Sheet for message logging.
- A Google Doc for note organization.

## Setup Instructions
### 1. Twilio Configuration
- Purchase a Twilio phone number that supports SMS.
- In the Twilio console, configure the phone number to send incoming messages to a webhook.
- Set the webhook URL to point to your Google Apps Script endpoint.

### 2. Google Apps Script Webhook
- Create a new Google Apps Script project.
- Deploy as a web app and note the URL.
- Set up the script to handle HTTP POST requests and write incoming messages to a designated Google Sheet.

### 3. Google Sheet Setup
- Create a Google Sheet with columns for timestamp, sender, and message content.
- Link the webhook script to automatically populate new entries.

### 4. Google Apps Script for Google Doc Processing
- Develop another Google Apps Script to monitor the sheet for new records.
- Parse the new entry and append it to the appropriate Google Doc.

## Usage
- Send an SMS to the Twilio phone number.
- The message is logged in the Google Sheet.
- The second script processes the record and adds it to the designated Google Doc.
- The note is now available for future reference.

## Future Enhancements
- Implement categorization for notes based on message content.
- Add authentication and access control.
- Integrate AI-powered summarization for messages.
- Integrate image ingestion


