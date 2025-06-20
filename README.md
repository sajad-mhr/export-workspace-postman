# 📨 Postman Workspace Exporter

This Node.js utility exports **all your Postman workspaces**, collects their associated **collections**, and saves each workspace’s collections inside a separate `.zip` file named after the workspace.

---

## ✨ Features

- 🔐 Loads Postman API key from `.env`
- 📦 Exports **all collections** from **every workspace**
- 🗂 Creates a `.zip` file per workspace with its collections inside
- 💾 Clean and safe filenames (Windows/macOS/Linux-friendly)
- ✅ Simple setup with `npm start`

---

## 📁 Project Structure

```

.
├── index.js               # Main script
├── package.json
├── .env                  # Holds your API Key
├── node\_modules/
└── \*.zip                 # Output files (one per workspace)

````

---

## 🚀 Getting Started

### 1. Clone this project

```bash
git clone https://github.com/your-username/postman-workspace-exporter.git
cd export-workspace-postman
````

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API Key

Create a `.env` file in the project root with the following content:

```
API_KEY=your_postman_api_key_here
```

> You can generate your API key from your Postman account:
> **Profile icon > Account Settings > API Keys**

### 4. Run the script

```bash
npm start
```

---

## 📂 Output

After running, you'll get files like:

```
Team Workspace.zip
QA Testing.zip
Internal Tools.zip
```

Each `.zip` file contains JSON exports of the collections inside that workspace:

```
Team Workspace.zip
├── Users API.json
├── Orders API.json
└── ...
```

---

## 🧩 Notes

* Workspaces without collections are skipped automatically.
* Filenames are sanitized to avoid issues with invalid characters.
* Uses [`archiver`](https://www.npmjs.com/package/archiver) for ZIP compression and [`axios`](https://www.npmjs.com/package/axios) for API requests.

---

## 🛠 Scripts

Inside `package.json`:

```json
"scripts": {
  "start": "node index.js"
}
```

---

## 📜 License

MIT — use, share, or modify freely.

---

## 👤 Author

Made with ❤️ by Sajjad Mehri
