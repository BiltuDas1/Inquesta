# Deployment Guide

This guide explains the deployment steps for the Inquesta application.

## 1. Backend Deployment

### Step 1.1: Prepare and Upload Files

1. Create a ZIP archive of the files inside the `server` folder.

2. Navigate to Hostinger Websites:
   [https://hpanel.hostinger.com/websites](https://hpanel.hostinger.com/websites)
3. Select `api.inquesta.org` and click **Dashboard**.
4. Choose **Redeploy** and upload the generated ZIP file of the backend code.

> [!WARNING]
> Do **NOT** touch or modify any default Hostinger settings during or after the backend deployment setup.

### Step 1.2: Run Database Migrations
Run the Drizzle database migrations locally from your machine to apply schema updates to the remote database:

```bash
# Set your MYSQL_URI environment variable pointing to the remote database, then run:
npm run migrate
```

## 2. Frontend Deployment (Cloudflare Pages)

### Step 2.1: Build Locally

1. Compile the frontend codebase:
   ```bash
   cd frontend
   npm run build
   ```
2. Create a ZIP archive of the files inside the `frontend/dist` folder.

### Step 2.2: Upload to Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** -> **Inquesta** -> **Create deployment**.
3. Upload the generated ZIP file of your `dist` folder.
4. Click **Save and Deploy site**.
