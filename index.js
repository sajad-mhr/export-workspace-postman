const fs = require('fs');
const path = require('path');
const axios = require('axios');
const archiver = require('archiver');
require('dotenv').config();

const API_KEY = process.env.API_KEY;

const headers = { 'X-Api-Key': API_KEY };

async function fetchAllWorkspaces() {
  try {
    const res = await axios.get('https://api.getpostman.com/workspaces', { headers });
    return res.data.workspaces;
  } catch (error) {
    console.error('❌ Error fetching workspaces:', error.message);
    process.exit(1);
  }
}

async function fetchWorkspaceDetails(workspaceId) {
  try {
    const res = await axios.get(`https://api.getpostman.com/workspaces/${workspaceId}`, { headers });
    return res.data.workspace;
  } catch (error) {
    console.error(`❌ Error fetching workspace ${workspaceId}:`, error.message);
    return null;
  }
}

async function fetchCollection(uid) {
  try {
    const res = await axios.get(`https://api.getpostman.com/collections/${uid}`, { headers });
    return res.data;
  } catch (error) {
    console.error(`❌ Error fetching collection ${uid}:`, error.message);
    return null;
  }
}

async function exportWorkspaceToZip(workspace) {
  const safeName = workspace.name.replace(/[<>:"/\\|?*]+/g, '-');
  const tempDir = path.join(__dirname, `tmp-${safeName}-${Date.now()}`);
  fs.mkdirSync(tempDir);

  if (!workspace.collections || workspace.collections.length === 0) {
    console.log(`ℹ️ Skipping workspace "${workspace.name}" (no collections)`);
    return;
  }

  console.log(`📦 Exporting workspace: "${workspace.name}"`);

  for (const col of workspace.collections) {
    const colData = await fetchCollection(col.id);
    if (!colData) continue;
    const colName = col.name.replace(/[<>:"/\\|?*]+/g, '-');
    const filePath = path.join(tempDir, `${colName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(colData, null, 2), 'utf-8');
    console.log(`✅ Saved: ${filePath}`);
  }

  const zipPath = path.join(__dirname, `${safeName}.zip`);
  await zipDirectory(tempDir, zipPath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`📁 Created ZIP: ${zipPath}`);
}

async function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

(async () => {
  const workspaces = await fetchAllWorkspaces();
  for (const ws of workspaces) {
    const fullWorkspace = await fetchWorkspaceDetails(ws.id);
    if (fullWorkspace) {
      await exportWorkspaceToZip(fullWorkspace);
    }
  }

  console.log('\n export and create zip file per workSpace successfully');
})();
