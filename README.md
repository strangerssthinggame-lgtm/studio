# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Fixing Image Uploads (CORS Configuration)

If you are having trouble uploading images and seeing permission errors, you need to configure Cross-Origin Resource Sharing (CORS) on your Firebase Storage bucket. This is a one-time setup step.

**1. Install Google Cloud CLI:**

If you don't have it, install the [Google Cloud CLI](https://cloud.google.com/sdk/install).

**2. Login to gcloud:**

Run the following command in your terminal and follow the prompts:

```bash
gcloud auth login
```

**3. Apply the CORS configuration:**

Find your Storage Bucket URL in the Firebase Console under "Storage" -> "Files". It will look like `gs://your-project-id.appspot.com`.

Run the following command, replacing `YOUR_STORAGE_BUCKET_URL` with your actual bucket URL:

```bash
gsutil cors set cors.json YOUR_STORAGE_BUCKET_URL
```

For example:
```bash
gsutil cors set cors.json gs://vibeverse-1a2b3.appspot.com
```

This will apply the settings from the `cors.json` file in this project to your bucket, allowing image uploads from your app to succeed.
