# 📨 Postman Workspace Exporter

This Node.js utility exports **all your Postman workspaces**, collects their associated **collections**, and saves each workspace’s collections inside a separate `.zip` file named after the workspace. It also exports all **environments** into a separate archive.

---

## ✨ Features

- 🔐 Loads Postman API key from `.env`
- 📦 Exports **all collections** from **every workspace**
- 🌍 Exports **all environments** used in your Postman team
- 🗂 Creates a `.zip` file per workspace (plus one for environments)
- 📁 All output saved inside an `/exports` folder
- 💾 Clean and safe filenames (Windows/macOS/Linux-friendly)
- ✅ Simple setup with `npm start`

---

## 📁 Project Structure

```

.
├── index.js               # Main script
├── package.json
├── .env                   # Holds your API Key
├── node\_modules/
└── exports/               # Output ZIP files
├── Team Workspace.zip
├── QA Testing.zip
├── Internal Tools.zip
└── Environments.zip

````

---

## 🚀 Getting Started

### 1. Clone this project

```bash
git clone https://github.com/your-username/postman-workspace-exporter.git
cd postman-workspace-exporter
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

After running, you'll get `.zip` files like:

```
exports/
├── Team Workspace.zip
├── QA Testing.zip
├── Internal Tools.zip
└── Environments.zip
```

Each workspace `.zip` contains the collections in JSON format.
`Environments.zip` contains all available environments.

---

## 🧩 Notes

* Workspaces without collections are skipped automatically (no ZIP created).
* Filenames are sanitized to avoid OS issues.
* Uses [`archiver`](https://www.npmjs.com/package/archiver) for ZIP compression and [`axios`](https://www.npmjs.com/package/axios) for HTTP requests.

---

## 🛠 Scripts

Defined in `package.json`:

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

Made with ❤️ by **Sajjad Mehri**
