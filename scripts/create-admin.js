// Creates the admin from ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env,
// or resets that admin's password if the email already exists.  Usage: npm run admin:create
require('dotenv/config');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

(async () => {
  const { ADMIN_NAME = 'Admin', ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
  if (ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD in .env must be at least 12 characters');
  const db = new Client({ connectionString: DATABASE_URL });
  await db.connect();
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const { rows } = await db.query(
    `INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, 'super_admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, is_active = true
     RETURNING (xmax = 0) AS created`,
    [ADMIN_NAME, ADMIN_EMAIL, hash]
  );
  console.log(rows[0].created ? `Admin created: ${ADMIN_EMAIL}` : `Admin password reset: ${ADMIN_EMAIL}`);
  await db.end();
})().catch(err => { console.error(err.message); process.exit(1); });
