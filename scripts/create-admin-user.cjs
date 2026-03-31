/**
 * Creates a Supabase Auth user + admin_users row for an admin login.
 *
 * Requires: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env (repo root)
 *
 * Usage:
 *   node scripts/create-admin-user.cjs              # dry-run
 *   node scripts/create-admin-user.cjs --confirm    # create user + whitelist
 *
 * Defaults match the requested admin1 account; override with env:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/create-admin-user.cjs --confirm
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.ADMIN_EMAIL || 'admin1@instrakventurecapital.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const CONFIRM = process.argv.includes('--confirm');

async function main() {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
        console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
        process.exit(1);
    }

    if (!CONFIRM) {
        console.log('Dry run. Would create Auth user + admin_users row for:');
        console.log('  Email:', EMAIL);
        console.log('  Password: (hidden)');
        console.log('Run with --confirm to apply.');
        process.exit(0);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: EMAIL,
        password: PASSWORD,
        email_confirm: true,
    });

    if (createErr) {
        const msg = createErr.message || '';
        if (/already|registered|exists/i.test(msg)) {
            console.warn('Auth user may already exist:', msg);
        } else {
            console.error('createUser failed:', createErr);
            process.exit(1);
        }
    } else {
        console.log('Auth user created:', created.user?.id);
    }

    const { error: upsertErr } = await supabase.from('admin_users').upsert(
        { email: EMAIL, role: 'admin' },
        { onConflict: 'email' }
    );

    if (upsertErr) {
        console.error('admin_users upsert failed:', upsertErr);
        process.exit(1);
    }

    console.log('admin_users row ensured for', EMAIL);
    console.log('Done. Sign in to the admin app with this email and password.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
