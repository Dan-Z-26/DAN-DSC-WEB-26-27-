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
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

let TURSO_URL = (process.env.TURSO_DATABASE_URL || 'https://dsc-dscsrmrmp.aws-ap-south-1.turso.io').replace('libsql://', 'https://');
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

async function executeSql(sql) {
  const res = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql } },
        { type: 'close' }
      ]
    })
  });
  return res.json();
}

async function run() {
  // 1. Add VIJAY ARAVINDRAM (missing from original seed)
  console.log('Adding VIJAY ARAVINDRAM S A...');
  const r1 = await executeSql(`INSERT OR REPLACE INTO team_members (id, name, img, team, insta, linkedin, x, lead, github) VALUES (40, 'VIJAY ARAVINDRAM S A', 'https://cdn.developerstudents.club/team/VIJAY_ARAVINDRAM_S_A.jpg', 'OPERATIONS', 'https://www.instagram.com/vijay_aravindram?igsh=aWdzYWt4eXZtaTdm', 'https://www.linkedin.com/in/vijay-aravindram-s-a-53b39431a', 'https://x.com/Vijay_Arav_07', 0, 'https://github.com/Vijay2007-coder')`);
  console.log('VIJAY result:', JSON.stringify(r1.results?.[0]?.response?.result?.affected_row_count));

  // 2. Update lead team values to include LEAD suffix for clarity
  console.log('Updating lead team values...');
  const r2 = await executeSql("UPDATE team_members SET team = 'TECHNICAL LEAD' WHERE id = 27");
  console.log('SRIVARSAN update:', JSON.stringify(r2.results?.[0]?.response?.result?.affected_row_count));

  const r3 = await executeSql("UPDATE team_members SET team = 'OPERATIONS LEAD' WHERE id = 28");
  console.log('SAGARIKA update:', JSON.stringify(r3.results?.[0]?.response?.result?.affected_row_count));

  const r4 = await executeSql("UPDATE team_members SET team = 'CREATIVES LEAD' WHERE id = 37");
  console.log('SHRIRAKSHA update:', JSON.stringify(r4.results?.[0]?.response?.result?.affected_row_count));

  // 3. Verify
  console.log('\nVerification:');
  const verify = await executeSql('SELECT id, name, team, lead FROM team_members WHERE id IN (27, 28, 37, 40) ORDER BY id');
  const rows = verify.results?.[0]?.response?.result?.rows || [];
  rows.forEach(r => console.log(r.map(c => c.value || 'NULL').join(' | ')));

  const countRes = await executeSql('SELECT count(*) as cnt FROM team_members');
  console.log('\nTotal members:', countRes.results?.[0]?.response?.result?.rows?.[0]?.[0]?.value);
}

run();
