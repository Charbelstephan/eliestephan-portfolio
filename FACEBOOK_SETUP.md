# Facebook Page API Setup Guide

This guide walks you through generating a Facebook **Page ID** and **Page Access Token** to fetch photos from your Facebook Page.

---

## Prerequisites

- A Facebook account
- A Facebook Page you manage
- A Meta Developer account

---

## Step 1: Create a Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Accept the developer terms if prompted

## Step 2: Create a New App

1. Click **My Apps** in the top navigation
2. Click **Create App**
3. Select **Business** as the app type
4. Fill in:
   - **App Name**: Choose any name (e.g., "My Portfolio")
   - **Contact Email**: Your email
5. Click **Create App**

## Step 3: Get Your Facebook Page ID

1. Go to your Facebook Page
2. Click **About** (or go to Page Settings)
3. Scroll down to find your **Page ID** (a numeric ID)
4. Alternatively, use the Graph API Explorer:
   ```
   GET /me/accounts?access_token={USER_ACCESS_TOKEN}
   ```
   This returns all Pages you manage with their IDs.

## Step 4: Generate a Page Access Token

### Option A: Using Graph API Explorer (Quick)

1. Go to the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the **Application** dropdown
3. Click **Generate Access Token**
4. Grant the following permissions when prompted:
   - `pages_show_list`
   - `pages_read_engagement`
5. In the query field, enter: `me/accounts`
6. Click **Submit**
7. Find your Page in the response and copy its `access_token`

### Option B: Using Access Token Debugger (Recommended for Production)

1. Take the short-lived Page Access Token from Option A
2. Go to the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
3. Paste your token and click **Debug**
4. Click **Extend Access Token** at the bottom to get a long-lived token (valid for ~60 days)

### Option C: Get a Never-Expiring Page Token

1. First, get a long-lived **User** Access Token:
   ```
   GET https://graph.facebook.com/v19.0/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &fb_exchange_token={SHORT_LIVED_USER_TOKEN}
   ```
2. Then, request the Page Access Token using the long-lived user token:
   ```
   GET https://graph.facebook.com/v19.0/me/accounts?access_token={LONG_LIVED_USER_TOKEN}
   ```
3. The Page Access Token returned here **does not expire** as long as the user token is long-lived.

## Step 5: Update Your Environment File

Open `src/environments/environment.ts` and paste your values:

```typescript
export const environment = {
  production: false,
  facebookPageAccessToken: 'YOUR_PAGE_ACCESS_TOKEN',
  facebookPageId: 'YOUR_PAGE_ID',
};
```

---

## Important Notes

- **Never commit real tokens to a public repository.** Add `environment.ts` to `.gitignore` and use `environment.example.ts` as a template.
- Short-lived Page tokens expire in **1 hour**; extended tokens last **~60 days**; tokens obtained via a long-lived user token **never expire**.
- The app uses the endpoint `/{pageId}/photos?type=uploaded&fields=images,name` to fetch uploaded photos with their full-resolution image URLs.
