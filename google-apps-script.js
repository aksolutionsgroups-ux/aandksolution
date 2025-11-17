/**
 * Google Apps Script for handling contact form submissions
 * This script should be deployed as a web app in Google Apps Script
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a Google Sheet and note its ID
 * 5. Deploy as web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and use it in your website
 */

// Configuration - Update these values
const CONFIG = {
    // Replace with your Google Sheet ID (found in the URL)
    SHEET_ID: '1i4OQFOaTwVBxz-Z2TC7Iy1Q_MivgOt4aQhnHJsQadRI',

    // Sheet name (tab name) where data will be stored
    SHEET_NAME: 'AK Solutions Submit Data',

    // Email notifications (optional)
    NOTIFICATION_EMAIL: 'aksolutionsgroups@gmail.com',

    // Rate limiting (submissions per hour per IP)
    RATE_LIMIT: 5
};

// Initialize the sheet with headers if it doesn't exist
function initializeSheet() {
    const sheet = getSheet();

    // Check if headers exist
    const headers = sheet.getRange(1, 1, 1, 8).getValues()[0];
    if (!headers[0] || headers[0] !== 'Timestamp') {
        // Add headers
        sheet.getRange(1, 1, 1, 8).setValues([
            ['Timestamp', 'Name', 'Email', 'WhatsApp', 'Business Type', 'Website Type', 'Budget', 'Message']
        ]);

        // Format headers
        const headerRange = sheet.getRange(1, 1, 1, 8);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#FFD700');
        headerRange.setFontColor('#000000');

        // Auto-resize columns
        sheet.autoResizeColumns(1, 8);
    }
}

// Get the Google Sheet
function getSheet() {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    }

    return sheet;
}

// Rate limiting function
function isRateLimited(ipAddress) {
    const cache = CacheService.getScriptCache();
    const key = `rate_limit_${ipAddress}`;
    const submissions = cache.get(key);

    if (submissions) {
        const submissionCount = parseInt(submissions);
        if (submissionCount >= CONFIG.RATE_LIMIT) {
            return true;
        }
        cache.put(key, submissionCount + 1, 3600); // 1 hour
    } else {
        cache.put(key, '1', 3600); // 1 hour
    }

    return false;
}

// Send email notification (optional)
function sendEmailNotification(formData) {
    if (!CONFIG.NOTIFICATION_EMAIL) return;

    const subject = 'New Contact Form Submission - AK Solutions';
    const body = `
    New contact form submission received:
    
    Name: ${formData.name}
    Email: ${formData.email}
    WhatsApp: ${formData.whatsapp || 'Not provided'}
    Business Type: ${formData.businessType}
    Website Type: ${formData.websiteType}
    Budget: ${formData.budget}
    Message: ${formData.message}
    
    Timestamp: ${new Date().toLocaleString()}`;

    try {
        MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

// Main function to handle form submission
function doPost(e) {
    try {
        // Parse the request data
        const data = JSON.parse(e.postData.contents);

        // Get client IP for rate limiting
        const ipAddress = e.parameter.ip || 'unknown';

        // Check rate limiting
        if (isRateLimited(ipAddress)) {
            return ContentService
                .createTextOutput(JSON.stringify({
                    success: false,
                    message: 'Too many submissions. Please try again later.'
                }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Validate required fields
        const requiredFields = ['name', 'email', 'businessType', 'websiteType', 'budget', 'message'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return ContentService
                    .createTextOutput(JSON.stringify({
                        success: false,
                        message: `Missing required field: ${field}`
                    }))
                    .setMimeType(ContentService.MimeType.JSON);
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return ContentService
                .createTextOutput(JSON.stringify({
                    success: false,
                    message: 'Invalid email format'
                }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Initialize sheet if needed
        initializeSheet();

        // Get the sheet and add data
        const sheet = getSheet();
        const timestamp = new Date();

        // Prepare row data
        const rowData = [
            timestamp,
            data.name.trim(),
            data.email.trim(),
            data.whatsapp ? data.whatsapp.trim() : '',
            data.businessType,
            data.websiteType,
            data.budget,
            data.message.trim()
        ];

        // Add data to sheet
        sheet.appendRow(rowData);

        // Format the new row
        const lastRow = sheet.getLastRow();
        const newRowRange = sheet.getRange(lastRow, 1, 1, 8);
        newRowRange.setBackground('#f0f0f0');
        newRowRange.setBorder(true, true, true, true, true, true);

        // Auto-resize columns
        sheet.autoResizeColumns(1, 8);

        // Send email notification
        sendEmailNotification(data);

        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                message: 'Form submitted successfully! We\'ll get back to you within 2 hours.',
                submissionId: lastRow
            }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        console.error('Error processing form submission:', error);

        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                message: 'An error occurred while processing your submission. Please try again.'
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle GET requests (for testing)
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({
            message: 'AK Solutions Contact Form API',
            status: 'active',
            timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify setup
function testSetup() {
    try {
        initializeSheet();
        console.log('Sheet initialized successfully');

        // Test data
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            whatsapp: '+91-9876543210',
            businessType: 'restaurant',
            websiteType: 'static',
            budget: '5k-10k',
            message: 'This is a test submission'
        };

        // Simulate POST request
        const mockEvent = {
            postData: {
                contents: JSON.stringify(testData)
            },
            parameter: {
                ip: '127.0.0.1'
            }
        };

        const result = doPost(mockEvent);
        console.log('Test submission result:', result.getContent());

    } catch (error) {
        console.error('Test failed:', error);
    }
}