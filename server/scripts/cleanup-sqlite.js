const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = ['ngdxh.sqlite', 'ngdxh.sqlite-wal', 'ngdxh.sqlite-shm'];

for (const f of files) {
  const p = path.join(dataDir, f);
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log('removed', p);
    }
  } catch (err) {
    console.error('failed to remove', p, err.message);
  }
}

// remove data dir if empty
try {
  const entries = fs.readdirSync(dataDir);
  if (entries.length === 0) {
    fs.rmdirSync(dataDir);
    console.log('removed empty data dir', dataDir);
  }
} catch (err) {
  // ignore
}
