import fs from 'fs';
import path from 'path';

// Try loading .env if not already in process.env
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
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODk0MDcxNTEsImlkIjoiMDFhMGEwZjktYjYwMS03ZGJlLTkzMTQtZmNkMDVhNDVlNDhhIiwia2lkIjoiWFpUMjFKc1dfaVNic1pLYnJXMUZJbFZMS3FIdEQxVGpiUnctbWJtZTNjVSIsInJpZCI6IjkwMjliZjdlLTZiYTMtNDc2ZC1hMGY4LWZhNTFlNjk5Y2E0NSJ9.MJNEDy8E20dSCd1FeFKjRDHeSxVfI45Qe8Od9NTlYopqBU_jNgROhYUtNDynUX_OQG5UNszjm4cqheC2hmKtBQ';

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

const insertSql = `
INSERT OR REPLACE INTO team_members
  (id, name, img, team, insta, linkedin, x, lead, github)
VALUES
  (1, 'AARUSH NASKAR', 'https://cdn.developerstudents.club/team/Aarush_Naskar.png', NULL, NULL, NULL, NULL, false, NULL),
  (2, 'ABHILASH MAHATA', 'https://cdn.developerstudents.club/team/Abhilash_Mahata.png', 'TECHNICAL', 'https://www.instagram.com/abhi726_?igsh=MW16eDNnN3ozMTUzdw==', 'https://www.linkedin.com/in/abhilash-mahata-334390331', 'https://x.com/Abhilash1690532', false, 'https://github.com/abhiMahata'),
  (3, 'ADITHIYA SHANKARANARAYANAN', 'https://cdn.developerstudents.club/team/Adithiya_Shankaranarayanan.png', 'TECHNICAL', 'https://www.instagram.com/adithiya_frfr?igsh=MTc3MWhyOG00NzV5eg==', 'https://www.linkedin.com/in/adithiya-shankaranarayanan-53049b309?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 'https://x.com/BluGame80763453?t=fFKcba9KlmhhyDsL90EdRQ&s=09', false, NULL),
  (4, 'SHAIK AHAMED', 'https://cdn.developerstudents.club/team/Ahamed_-_Tauqeer_Ahamed.png', 'TECHNICAL', 'https://www.instagram.com/cid_wala_banda_huuu?igsh=N2x1MDk5cHZ6MDJs', 'https://www.linkedin.com/in/tauqeer-ahamed-596533327?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'https://x.com/TauqeerAha83249', false, 'https://github.com/tauqeerahamed07'),
  (5, 'AISHWARYADEVI', 'https://cdn.developerstudents.club/team/AISHWARYADEVI.png', NULL, NULL, NULL, NULL, false, NULL),
  (6, 'ANANTHA VISHWA PRIYA Y', 'https://cdn.developerstudents.club/team/Anantha_Vishwa_Priya_Y.png', NULL, NULL, NULL, NULL, false, NULL),
  (7, 'ANIRUDH HARISH', 'https://cdn.developerstudents.club/team/Anirudh_Harish.png', NULL, NULL, NULL, NULL, false, NULL),
  (8, 'ANJALI', 'https://cdn.developerstudents.club/team/ANJALI.png', NULL, NULL, NULL, NULL, false, NULL),
  (9, 'ARUN MOHAN K', 'https://cdn.developerstudents.club/team/Arun_mohan_k.png', NULL, NULL, NULL, NULL, false, NULL),
  (10, 'ASHWIN B.G', 'https://cdn.developerstudents.club/team/B.G._Ashwin.png', 'OPERATIONS', 'https://www.instagram.com/_ashwin__1926?igsh=MWR4ZWVwZnB3ejhwdA%3D%3D&utm_source=qr', 'https://www.linkedin.com/in/b-g-ashwin-aa2749199/', NULL, false, 'https://github.com/bgashwin13-CS'),
  (11, 'BHAVNA', 'https://cdn.developerstudents.club/team/Bhavna.png', NULL, NULL, NULL, NULL, false, NULL),
  (12, 'CHOUHAN TEJ', 'https://cdn.developerstudents.club/team/Chouhan_Tej.png', 'TECHNICAL', 'https://www.instagram.com/ada.ponga.daa.dei/', 'https://www.linkedin.com/in/chouhan-tej-386a672aa', 'https://x.com/ChouhanTej1', false, 'https://github.com/ChouhanTej'),
  (13, 'DHANYA SENTHIL ARASU', 'https://cdn.developerstudents.club/team/DHANYA_SENTHIL_ARASU_.png', 'CREATIVES', 'https://www.instagram.com/dhandazzle?igsh=MWZucXBkbXd1dTluNQ==', 'https://www.linkedin.com/in/dhanyasenthilarasu/', NULL, false, 'https://github.com/dhanyasenthilars'),
  (14, 'G. RAMYASHREE', 'https://cdn.developerstudents.club/team/G.Ramyashree.png', 'CREATIVES', 'https://www.instagram.com/_.moonlight_galaxy._?igsh=ZnFxajUzYzZhdnRo', 'https://www.linkedin.com/in/ramyashree-g-4a5906336?utm_source=share_via&utm_content=profile&utm_medium=member_android', NULL, false, 'https://github.com/gramyashree'),
  (15, 'J. A. PAVITHRAN', 'https://cdn.developerstudents.club/team/J._A._PAVITHRAN.png', NULL, NULL, NULL, NULL, false, NULL),
  (16, 'KHUSHAL MITTAL', 'https://cdn.developerstudents.club/team/KHUSHAL_MITTAL.png', 'PRESIDENT', NULL, NULL, NULL, true, NULL),
  (17, 'KAAVIYA', 'https://cdn.developerstudents.club/team/Kaaviya.png', NULL, NULL, NULL, NULL, false, NULL),
  (18, 'KHIMIL KUMAR', 'https://cdn.developerstudents.club/team/Kumar.png', 'OPERATIONS', 'https://www.instagram.com/khimil.kumar', 'https://www.linkedin.com/in/khimil-kumar-81b6b9285', NULL, false, 'https://github.com/KhimilKumar'),
  (19, 'M POOJA VERMA', 'https://cdn.developerstudents.club/team/M_Pooja_Verma.png', NULL, NULL, NULL, NULL, false, NULL),
  (20, 'G MADHUMITHA', 'https://cdn.developerstudents.club/team/Madhumitha.png', 'TECHNICAL', 'https://www.instagram.com/mad20_67?igsh=MTBtZTdibWJ3ZHZwYQ==', 'https://www.linkedin.com/in/madhumitha-g-57b37337b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', NULL, false, 'https://github.com/Madhu-206207'),
  (21, 'PRABHA', 'https://cdn.developerstudents.club/team/Prabha.png', NULL, NULL, NULL, NULL, false, NULL),
  (22, 'PRAJAKTA CHAKRABORTY', 'https://cdn.developerstudents.club/team/PrajaktaChakraborty.png', 'TECHNICAL', 'https://www.instagram.com/404not_alive?igsh=MThmZzFqZmowOGR0YQ==', 'https://www.linkedin.com/in/prajakta-chakraborty-719512319/', NULL, false, 'https://github.com/PrajaktaChakraborty'),
  (23, 'PRANES KUMAR B', 'https://cdn.developerstudents.club/team/Pranes_Kumar_B.png', NULL, NULL, NULL, NULL, false, NULL),
  (24, 'PRISHHA', 'https://cdn.developerstudents.club/team/Prishha.png', NULL, NULL, NULL, NULL, false, NULL),
  (25, 'RITHISH', 'https://cdn.developerstudents.club/team/Rithish.png', NULL, NULL, NULL, NULL, false, NULL),
  (26, 'SREEDEV D S', 'https://cdn.developerstudents.club/team/SREEDEV.png', 'CREATIVES', 'https://www.instagram.com/sreed__v', 'https://www.linkedin.com/in/sreedev-d-s-854b10330?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'https://x.com/SREEDEV18270', false, 'https://github.com/Sreedevds'),
  (27, 'K SRIVARSAN', 'https://cdn.developerstudents.club/team/SRIVARSAN_K.png', 'TECHNICAL LEAD', 'https://www.instagram.com/srivarsankannan/', 'https://www.linkedin.com/in/ksrivarsan', 'https://x.com/SrivarsanK', true, NULL),
  (28, 'SAGARIKA MISRA', 'https://cdn.developerstudents.club/team/Sagarika__Mishra.png', 'OPERATIONS LEAD', 'https://www.instagram.com/sagarika7_/', 'https://www.linkedin.com/in/sagarika-mishra-ab151a358/', 'https://x.com/Sagarik66632312', true, NULL),
  (29, 'SAI SRI KIRAN S', 'https://cdn.developerstudents.club/team/Sai_Sri_Kiran_S.png', 'CREATIVES', 'https://www.instagram.com/shaye.mov?igsh=MXhlZnh1M25wZ3Bjdg==', 'https://www.linkedin.com/in/saisrikiran?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'https://x.com/Sanzaneig', false, 'https://github.com/sanzane'),
  (30, 'SANJAY KUMAR SAKAMURI KAMALAKAR', 'https://cdn.developerstudents.club/team/Sanjay_Kumar_Sakamuri_Kamalakar.png', NULL, NULL, NULL, NULL, false, NULL),
  (31, 'SILVI', 'https://cdn.developerstudents.club/team/Silvi.png', NULL, NULL, NULL, NULL, false, NULL),
  (32, 'THAVANESH CM', 'https://cdn.developerstudents.club/team/Thavanesh_CM.png', 'TECHNICAL', 'https://www.instagram.com/thavanesh.cm?igsh=MWttN20xN3I2ZzN3YQ==', 'https://www.linkedin.com/in/thavanesh-cm-9130ba380', 'https://x.com/thavaneshcm', false, 'https://github.com/thavanesh-cm'),
  (33, 'BADRINARAYAN', 'https://cdn.developerstudents.club/team/badrinarayan.png', NULL, NULL, NULL, NULL, false, NULL),
  (34, 'HARSHITHASB', 'https://cdn.developerstudents.club/team/harshithasb.png', NULL, NULL, NULL, NULL, false, NULL),
  (35, 'MEERAAJ', 'https://cdn.developerstudents.club/team/meeraaj.png', NULL, NULL, NULL, NULL, false, NULL),
  (36, 'DEEPAK P J', 'https://cdn.developerstudents.club/team/pavi_deepam.png', 'CREATIVES', 'https://www.instagram.com/_depaak._?igsh=aDltczJydXRhbXdn', 'https://www.linkedin.com/in/deepak-p-j-16862837b?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'https://x.com/Depaak1807', false, 'https://github.com/DEEPAK18-12'),
  (37, 'SHRIRAKSHA S', 'https://cdn.developerstudents.club/team/S.SHRIRAKSHA.jpeg', 'CREATIVES LEAD', 'https://www.instagram.com/sothappalsha?igsh=MWlseGFodWE3dG1iMg%3D%3D&utm_source=qr', 'https://www.linkedin.com/in/shri-raksha-s-9217b6322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', NULL, true, NULL),
  (38, 'A. SRI LAKSHMI', 'https://cdn.developerstudents.club/team/srilakshmi.png', 'OPERATIONS', 'https://www.instagram.com/srilakshmi_ak/', 'https://www.linkedin.com/in/sri-lakshmi-a-813534251/', NULL, false, 'https://github.com/sri-0908'),
  (39, 'TATINI', 'https://cdn.developerstudents.club/team/tatini.png', NULL, NULL, NULL, NULL, false, NULL),
  (40, 'VIJAY ARAVINDRAM S A', 'https://cdn.developerstudents.club/team/VIJAY_ARAVINDRAM_S_A.jpg', 'OPERATIONS', 'https://www.instagram.com/vijay_aravindram?igsh=aWdzYWt4eXZtaTdm', 'https://www.linkedin.com/in/vijay-aravindram-s-a-53b39431a', 'https://x.com/Vijay_Arav_07', false, 'https://github.com/Vijay2007-coder');
`;

async function run() {
  console.log('Inserting team members...');
  const res = await executeSql(insertSql);
  console.log('Insert result:', JSON.stringify(res, null, 2));

  console.log('Verifying rows count...');
  const verifyRes = await executeSql('SELECT count(*) as count FROM team_members;');
  console.log('Count:', JSON.stringify(verifyRes, null, 2));

  const sampleRes = await executeSql('SELECT * FROM team_members LIMIT 5;');
  console.log('Sample data:', JSON.stringify(sampleRes, null, 2));
}

run();
