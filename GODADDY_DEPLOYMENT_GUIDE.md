# GoDaddy Deployment Instructions for acttechnical.com

Follow these step-by-step instructions to deploy your **acttechnical.com** website along with the integrated **wfgfnaform (FNA Tool)** directly to GoDaddy.

---

## Step 1: Locate Your Local Build Files
All files ready for upload are located in your local project folder:
📁 `C:\Users\DannyGeminiAnti\Documents\acttechnical Work`

Key files and folders to upload:
- `index.html` (Main website entry point)
- `contact.php` (Contact form handler)
- `fna/` (Integrated FNA Financial Analysis application folder)
- `css/` (Stylesheets)
- `js/` (JavaScript interactivity)
- `images/` & `assets/` (Logos, icons, and graphical assets)
- `sample/` (Sample website demonstration)

---

## Step 2: Log In to GoDaddy cPanel
1. Go to [GoDaddy.com](https://www.godaddy.com) and sign in to your account.
2. Go to **My Products** → scroll to **Web Hosting** (or cPanel Hosting) → Click **Manage**.
3. Click **cPanel Admin** to open the hosting dashboard.

---

## Step 3: Open File Manager
1. Inside cPanel, under the **Files** section, click on **File Manager**.
2. In the left panel, navigate to the **`public_html`** folder (this is the root directory for `acttechnical.com`).

> ⚠️ *Note: If `public_html` already has an old `index.html` or default page, back it up or move it into an archive folder before uploading.*

---

## Step 4: Upload Your Site Files
### Option A: Direct Folder Upload via File Manager
1. Click the **Upload** button at the top toolbar in File Manager.
2. Drag and drop all files from `C:\Users\DannyGeminiAnti\Documents\acttechnical Work` into the upload zone.
3. Make sure the **`fna/`** folder is uploaded intact as a subfolder so visitors can access `acttechnical.com/fna/index.html`.

### Option B: Zip Upload (Faster & Recommended)
1. On your computer, select all contents of `C:\Users\DannyGeminiAnti\Documents\acttechnical Work` (or compress the directory into `acttechnical_deploy.zip`).
2. In cPanel File Manager, click **Upload** and upload `acttechnical_deploy.zip`.
3. Right-click `acttechnical_deploy.zip` in `public_html` and select **Extract**.

---

## Step 5: Verify Your Live Website
Once uploaded, open your web browser and test the following links:
* 🌐 **Main Website**: `https://acttechnical.com`
* 📊 **FNA Tool**: `https://acttechnical.com/fna/index.html` (or click the **"FNA Tool"** button in the header navigation or Services section).

---

## Summary of URLs After Deployment
- `acttechnical.com` → Main Technical Excellence Portal
- `acttechnical.com/fna/` → Interactive Financial Needs Analysis Form
- `acttechnical.com/sample/` → Driving School Sample Portal
