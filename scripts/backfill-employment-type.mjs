// Clasifica la coleccion /experiences de Firestore en empresa vs. freelance.
//
//   node scripts/backfill-employment-type.mjs            # VALIDAR (solo lectura, no escribe)
//   node scripts/backfill-employment-type.mjs --write    # escribe el campo employmentType
//
// Fuente de verdad: la lista FREELANCE de abajo (empresas cuyo trabajo fue freelance).
// Todo lo que no este en esa lista se marca como 'company'.
//
// Auth para --write (la regla exige usuario autenticado):
//   PowerShell:  $env:FB_ADMIN_EMAIL="..."; $env:FB_ADMIN_PASSWORD="..."; node scripts/backfill-employment-type.mjs --write
//
// Idempotente: omite los documentos que ya tienen el valor correcto.
// El codigo trata la ausencia del campo como 'company', asi que correrlo es opcional:
// solo deja el dato explicito en Firestore en vez de implicito por defecto.
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Empresas cuyo trabajo fue freelance (comparacion sin acentos/mayusculas/espacios sobrantes)
const FREELANCE = ['Appetit', 'Altomayo', 'COLLIE VALLEY'];

const MODE = process.argv.includes('--write') ? 'write' : 'validate';
const here = (p) => new URL(p, import.meta.url);
const norm = (s) => (s || '').trim().toLowerCase();

// --- Config Firebase desde .env ---
const env = Object.fromEntries(
  readFileSync(here('../.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const freelanceSet = new Set(FREELANCE.map(norm));

const main = async () => {
  const snap = await getDocs(collection(db, 'experiences'));

  const rows = snap.docs.map((d) => {
    const data = d.data();
    const expected = freelanceSet.has(norm(data.company)) ? 'freelance' : 'company';
    return {
      id: d.id,
      company: data.company,
      period: `${data.startDate} - ${data.endDate}`,
      current: data.employmentType ?? null,
      expected,
      changes: data.employmentType !== expected,
    };
  });

  const toWrite = rows.filter((r) => r.changes);
  const unmatched = FREELANCE.filter((name) => !rows.some((r) => norm(r.company) === norm(name)));

  console.log(`\n== Clasificacion /experiences (proyecto ${env.VITE_FIREBASE_PROJECT_ID}) ==`);
  console.log(`Docs: ${snap.size} | Freelance esperados: ${rows.filter((r) => r.expected === 'freelance').length} | A escribir: ${toWrite.length}`);

  rows
    .sort((a, b) => a.company.localeCompare(b.company))
    .forEach((r) => {
      const mark = r.changes ? '*' : ' ';
      console.log(`  ${mark} ${r.company.trim().padEnd(24)} ${r.period.padEnd(28)} ${r.current ?? '(sin campo)'} -> ${r.expected}`);
    });

  if (unmatched.length) {
    console.warn(`\nAviso: estas empresas de la lista FREELANCE no existen en /experiences: ${unmatched.join(', ')}`);
  }

  if (MODE === 'validate') {
    console.log('\n[VALIDATE] Solo lectura. Para escribir: node scripts/backfill-employment-type.mjs --write');
    process.exit(0);
  }

  // --- WRITE ---
  if (toWrite.length === 0) { console.log('\nNada que escribir: ya esta todo clasificado.'); process.exit(0); }
  const email = process.env.FB_ADMIN_EMAIL;
  const password = process.env.FB_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('\nERROR: define FB_ADMIN_EMAIL y FB_ADMIN_PASSWORD en el entorno antes de --write.');
    process.exit(1);
  }
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);
  console.log(`\nAutenticado como ${auth.currentUser.email}`);

  let ok = 0;
  for (const r of toWrite) {
    await updateDoc(doc(db, 'experiences', r.id), { employmentType: r.expected });
    ok++;
    console.log(`  ~ ${r.company.trim()} -> ${r.expected}`);
  }
  await signOut(auth);
  console.log(`\nOK: ${ok} experiencias actualizadas.`);
  process.exit(0);
};

main().catch((e) => { console.error('ERROR:', e.code || '', e.message); process.exit(1); });
