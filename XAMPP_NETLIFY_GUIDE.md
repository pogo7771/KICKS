# Deployment Guide: Netlify (Frontend) + XAMPP (Backend)

This guide explains how to host your **Frontend on Netlify** and run your **Backend using XAMPP (MySQL)**.

**Important Note**:
*   **Netlify** is on the public internet.
*   **XAMPP** usually runs on your local computer (`localhost`).
*   To make them talk to each other, you must **Expose your Local Backend to the Internet** (using a tool like **Ngrok**) OR host XAMPP on a public server (VPS).

---

## Part 1: Backend Setup (XAMPP & MySQL)

1.  **Start XAMPP**:
    *   Open XAMPP Control Panel.
    *   Start **Apache** and **MySQL**.
2.  **Create Database**:
    *   Go to `http://localhost/phpmyadmin` in your browser.
    *   Click **New**.
    *   Database Name: `store_db`.
    *   Click **Create**. (No need to create tables, the app does it automatically).
3.  **Configure Backend**:
    *   In your `backend` folder, open `.env`.
    *   Add/Update these lines:
        ```ini
        # Database Configuration
        DB_DIALECT=mysql
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=store_db
        PORT=5000
        ```
        *(Note: Default XAMPP root password is empty. If you changed it, put it here)*.
4.  **Start Backend**:
    *   Open Terminal in `backend` folder.
    *   Run: `npm start`.
    *   You should see: `Connected to SQL Database (MySQL)`.
5.  **Expose to Internet (Required for Netlify)**:
    *   Since Netlify can't see "localhost", use **Ngrok** to create a public link.
    *   Download Ngrok from [ngrok.com](https://ngrok.com).
    *   Run in terminal: `ngrok http 5000`.
    *   Copy the HTTPS URL (e.g., `https://a1b2-c3d4.ngrok-free.app`). **This is your Public Backend URL**.

---

## Part 2: Frontend Deployment (Netlify)

1.  **Push to GitHub**:
    *   Make sure your latest code is pushed to your GitHub repository.
2.  **Log in to Netlify**:
    *   Go to [netlify.com](https://www.netlify.com) and log in.
3.  **Add New Site**:
    *   Click **Add new site** -> **Import from Git**.
    *   Choose **GitHub** and select your `Store` repository.
4.  **Configure Build**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
5.  **Environment Variables** (Crucial Step):
    *   Click **Show advanced**.
    *   Click **New Variable**.
    *   **Key**: `VITE_API_URL`
    *   **Value**: *Paste your Ngrok URL from Part 1* (e.g., `https://a1b2-c3d4.ngrok-free.app/api`).
        *   *Make sure to add `/api` at the end!*
6.  **Deploy**:
    *   Click **Deploy site**.

---

## Part 3: Testing

1.  Open your **Netlify URL** (e.g., `https://sublime-store.netlify.app`).
2.  The app should load.
3.  Try to **Register/Login**.
    *   If it works, the request went from Netlify -> Ngrok -> Your XAMPP Backend -> MySQL.
4.  **Keep it Running**:
    *   You must keep your **Computer**, **XAMPP**, **Node Terminal**, and **Ngrok** running for the site to work.

## Alternative: Public XAMPP VPS
If you have a Windows VPS with XAMPP (public IP), skip Ngrok. Just use the VPS IP address as your `VITE_API_URL`.
