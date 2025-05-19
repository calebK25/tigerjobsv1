
# Setting Up Google Sheets Integration for Interview Tracker

This document provides instructions on how to set up the Google Sheets integration for the Interview Tracker application. The integration allows users to import interview data directly from Google Sheets.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on "Select a project" in the top bar, then click "New Project".
3. Enter a name for your project (e.g., "Interview Tracker") and click "Create".
4. Once the project is created, select it from the project dropdown.

## 2. Enable the Google Sheets API

1. In the left sidebar, navigate to "APIs & Services" > "Library".
2. Search for "Google Sheets API" and click on it.
3. Click "Enable" to activate the API for your project.

## 3. Configure OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen".
2. Select "External" as the user type and click "Create".
3. Fill in the required information:
   - App name: "Interview Tracker"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue".
5. On the "Scopes" screen, click "Add or Remove Scopes".
6. Add the scope `https://www.googleapis.com/auth/spreadsheets.readonly`.
7. Click "Save and Continue".
8. Add test users (including your own email) if you're in testing mode.
9. Review the information and click "Back to Dashboard".

## 4. Create OAuth 2.0 Credentials

1. In the left sidebar, navigate to "APIs & Services" > "Credentials".
2. Click "Create Credentials" and select "OAuth client ID".
3. Select "Web application" as the application type.
4. Enter a name for the OAuth client (e.g., "Interview Tracker Web Client").
5. Add Authorized JavaScript origins:
   - Add your application URL (e.g., `https://your-app-domain.com`)
   - For local development, add `http://localhost:5173` or your local development URL
6. Add Authorized redirect URIs:
   - Add `https://your-app-domain.com/import`
   - For local development, add `http://localhost:5173/import`
7. Click "Create".
8. A popup will display your client ID and client secret. Copy these values for the next step.

## 5. Configure the Application

1. Open the file `src/components/import/GoogleSheetsImport.tsx` in your application code.
2. Find the line with `const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";`.
3. Replace `YOUR_GOOGLE_CLIENT_ID` with the client ID you received from Google.
4. If needed, update the `GOOGLE_REDIRECT_URI` to match your application's deployment URL.

## 6. (For Production) Set Up Environment Variables

For a production environment, you should use environment variables to store the Google client ID instead of hardcoding it in the source code:

1. Set up the environment variable in your hosting platform:
   - Variable name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google Client ID
   
2. Update the code to use the environment variable:
   ```typescript
   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
   ```

## 7. Test the Integration

1. Launch your application and navigate to the Import page.
2. Click on "Import from Google Sheets".
3. You should be prompted to authenticate with Google.
4. After authentication, you can paste a Google Sheets URL and import the data.

## Troubleshooting

1. **Invalid redirect URI**: Make sure the redirect URI in your Google Cloud Console exactly matches the URL of your application's import page.
2. **Consent errors**: If you see consent errors, ensure your OAuth consent screen is properly configured and your email is added as a test user.
3. **Access token errors**: If you have issues with the access token, check the browser console for more detailed error messages.
4. **Cross-origin errors**: Ensure your application's URL is added to the authorized JavaScript origins in the Google Cloud Console.

## Security Considerations

- The application only requests read-only access to Google Sheets.
- No data is stored from the user's Google account except for the temporarily used access token.
- The token is stored in memory and never persisted to local storage or cookies.
