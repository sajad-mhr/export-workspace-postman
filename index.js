const fs = require('fs');
const path = require('path');
const axios = require('axios');
const archiver = require('archiver');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const headers = { 'X-Api-Key': API_KEY };


const EXPORT_DIR = path.join(__dirname, 'exports');
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);

// === Helpers ===

function safeName(name) {
  return name.replace(/[<>:"/\\|?*]+/g, '-');
}

function logStep(msg) {
  console.log(`\n🔹 ${msg}`);
}

// === Fetching Workspaces and Collections ===

async function fetchAllWorkspaces() {
  const res = await axios.get('https://api.getpostman.com/workspaces', { headers });
  return res.data.workspaces;
}

async function fetchWorkspaceDetails(workspaceId) {
  const res = await axios.get(`https://api.getpostman.com/workspaces/${workspaceId}`, { headers });
  return res.data.workspace;
}

async function fetchCollection(uid) {
  const res = await axios.get(`https://api.getpostman.com/collections/${uid}`, { headers });
  return res.data;
}

async function exportWorkspaceToZip(workspace) {
  const safe = safeName(workspace.name);
  const tempDir = path.join(__dirname, `tmp-${safe}-${Date.now()}`);
  fs.mkdirSync(tempDir);

  if (!workspace.collections || workspace.collections.length === 0) {
    console.log(`ℹ️ Skipping workspace "${workspace.name}" (no collections)`);
    fs.rmSync(tempDir, { recursive: true, force: true });
    return;
  }

  logStep(`Exporting workspace "${workspace.name}"`);

  for (const col of workspace.collections) {
    const colData = await fetchCollection(col.id);
    if (!colData) continue;
    const filePath = path.join(tempDir, `${safeName(col.name)}.json`);
    fs.writeFileSync(filePath, JSON.stringify(colData, null, 2), 'utf-8');
    console.log(`✅ Collection saved: ${filePath}`);
  }

  const zipPath = path.join(EXPORT_DIR, `${safe}.zip`);
  await zipDirectory(tempDir, zipPath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`📁 Created: ${zipPath}`);
}

// === Fetching Environments ===

async function fetchAllEnvironments() {
  const res = await axios.get('https://api.getpostman.com/environments', { headers });
  return res.data.environments;
}

async function fetchEnvironment(envId) {
  const res = await axios.get(`https://api.getpostman.com/environments/${envId}`, { headers });
  return res.data;
}

async function exportEnvironmentsToZip() {
  const envs = await fetchAllEnvironments();
  if (envs.length === 0) {
    console.log('ℹ️ No environments found.');
    return;
  }

  logStep('Exporting Environments...');
  const tempDir = path.join(__dirname, `tmp-envs-${Date.now()}`);
  fs.mkdirSync(tempDir);

  for (const env of envs) {
    const envData = await fetchEnvironment(env.id);
    if (!envData) continue;
    const filePath = path.join(tempDir, `${safeName(env.name)}.json`);
    fs.writeFileSync(filePath, JSON.stringify(envData, null, 2), 'utf-8');
    console.log(`✅ Environment saved: ${filePath}`);
  }

  const zipPath = path.join(EXPORT_DIR, `Environments.zip`);
  await zipDirectory(tempDir, zipPath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`📁 Created: ${zipPath}`);
}

// === Zip Utility ===

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

// === Main ===

(async () => {
  try {
    logStep('Fetching all workspaces...');
    const workspaces = await fetchAllWorkspaces();
    for (const ws of workspaces) {
      const full = await fetchWorkspaceDetails(ws.id);
      if (full) await exportWorkspaceToZip(full);
    }

    await exportEnvironmentsToZip();

    console.log('\n✅ All workspaces and environments exported successfully.');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
})();
