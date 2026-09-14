import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').trim();
      if (!process.env[key.trim()]) process.env[key.trim()] = val;
    }
  }
}

const TURSO_URL = (process.env.TURSO_DATABASE_URL || 'https://dsc-dscsrmrmp.aws-ap-south-1.turso.io').replace('libsql://', 'https://');
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

async function sql(query) {
  const res = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TURSO_AUTH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql: query } }, { type: 'close' }] })
  });
  const d = await res.json();
  return d.results[0]?.response?.result;
}

async function run() {
  // Fix: KHUSHAL MITTAL is President — set lead=1, team='PRESIDENT'
  const r = await sql("UPDATE team_members SET lead=1, team='PRESIDENT' WHERE id=16");
  console.log('Updated KHUSHAL MITTAL rows:', r?.affected_row_count);

  // Verify all leads
  const leads = await sql('SELECT id, name, team, lead FROM team_members WHERE lead=1 ORDER BY id');
  console.log('\nAll leads:');
  leads.rows.forEach(r => console.log(r.map(c => c.value || 'NULL').join(' | ')));
}

run();
