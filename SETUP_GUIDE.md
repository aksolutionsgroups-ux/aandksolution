# Contact Form to Google Sheets Setup Guide

This guide will help you set up your contact form to automatically store submissions in Google Sheets.

## Prerequisites
- Google account
- Access to Google Apps Script
- Your website files

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AK Solutions Contact Submissions" (or any name you prefer)
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - Sheet ID: `1ABC123DEF456GHI789JKL`

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Update the configuration in the script:
   ```javascript
   const CONFIG = { 
     SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE', // Replace with your Sheet ID
     SHEET_NAME: 'Contact Submissions',
     NOTIFICATION_EMAIL: 'your-email@example.com', // Optional: for email notifications
     RATE_LIMIT: 5 // Submissions per hour per IP
   };
   ```
5. Save the project (Ctrl+S)
6. Give it a name like "AK Solutions Contact Form Handler"

## Step 3: Deploy as Web App

1. In Google Apps Script, click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Update Your Website

1. Open `script.js` in your website
2. Find the `GOOGLE_SHEETS_CONFIG` section
3. Replace `YOUR_SCRIPT_ID` with your actual Web App URL:
   ```javascript
   const GOOGLE_SHEETS_CONFIG = {
     WEB_APP_URL: 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec',
     FALLBACK_EMAIL: 'info@aksolutions.com'
   };
   ```

## Step 5: Test the Setup

1. Open your website
2. Fill out the contact form
3. Submit it
4. Check your Google Sheet - you should see the data appear
5. Verify the notification appears on your website

## Features Included

### ✅ Automatic Data Storage
- All form submissions are stored in Google Sheets
- Timestamps are automatically added
- Data is organized in columns: Timestamp, Name, Email, WhatsApp, Business Type, Website Type, Budget, Message

### ✅ Rate Limiting
- Prevents spam by limiting submissions per IP address
- Configurable limit (default: 5 submissions per hour)

### ✅ Email Notifications (Optional)
- Get notified when new submissions arrive
- Configure in the Google Apps Script settings

### ✅ Error Handling
- Graceful fallback to email if Google Sheets fails
- User-friendly error messages
- Form validation before submission

### ✅ User Experience
- Loading states during submission
- Success/error notifications
- Form reset after successful submission

## Troubleshooting

### Form submissions not appearing in Google Sheets
1. Check that the Web App URL is correct in `script.js`
2. Verify the Sheet ID is correct in Google Apps Script
3. Make sure the web app is deployed with "Anyone" access
4. Check the browser console for error messages

### Getting "Too many submissions" error
- This is rate limiting working correctly
- Wait an hour or increase the `RATE_LIMIT` value in Google Apps Script

### Email fallback not working
- Check that `FALLBACK_EMAIL` is set correctly
- Ensure the email address is valid

## Security Notes

- The Google Apps Script web app is set to "Anyone" access for public form submissions
- Rate limiting prevents abuse
- All data is stored in your private Google Sheet
- No sensitive data is exposed in the client-side code

## Customization Options

### Adding More Fields
1. Update the form HTML to include new fields
2. Modify the `submissionData` object in `script.js`
3. Update the Google Apps Script to handle new fields
4. Add new columns to your Google Sheet

### Changing Email Notifications
- Modify the `NOTIFICATION_EMAIL` in Google Apps Script
- Customize the email template in the `sendEmailNotification` function

### Styling Notifications
- The notification styles are already included in `styles.css`
- Modify the `.notification` classes to change appearance

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Verify all URLs and IDs are correct
3. Test the Google Apps Script directly using the `testSetup()` function
4. Ensure your Google account has the necessary permissions

## Next Steps

Once everything is working:
1. Monitor your Google Sheet for new submissions
2. Set up automated responses if needed
3. Consider adding more advanced features like:
   - Automatic email responses to customers
   - Integration with CRM systems
   - Advanced analytics and reporting
   - Multi-language support
