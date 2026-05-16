// Sincroniza la coleccion /projects de Firestore con los repos de GitHub.
//
//   node scripts/sync-projects.mjs            # VALIDAR (solo lectura, no escribe)
//   node scripts/sync-projects.mjs --write    # escribe los curados faltantes
//   node scripts/sync-projects.mjs --export   # vuelca /projects -> projects-export.json
//
// Fuente de verdad: scripts/curated-projects.json (editable).
// Para agregar un proyecto a futuro: agregalo a ese JSON, valida y luego --write.
//
// Auth para --write (la regla exige usuario autenticado):
//   PowerShell:  $env:FB_ADMIN_EMAIL="..."; $env:FB_ADMIN_PASSWORD="..."; node scripts/sync-projects.mjs --write
//
// Idempotente: omite cualquier repo cuyo githubUrl ya exista en /projects.
// Doc: docs/PROJECTS_SYNC.md
import { readFileSync, writeFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

const GH_USER = 'gepres';
const MODE = process.argv.includes('--write')
  ? 'write'
  : process.argv.includes('--export')
    ? 'export'
    : 'validate';

const here = (p) => new URL(p, import.meta.url);
const ghUrl = (repo) => `https://github.com/${GH_USER}/${repo}`;
const normUrl = (u) => (u || '').toLowerCase().replace(/\.git$/, '').replace(/\/+$/, '');

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

const curated = JSON.parse(readFileSync(here('./curated-projects.json'), 'utf8'));

// Convierte Timestamps a ISO para JSON legible
const serialize = (v) => {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, serialize(x)]));
  return v;
};

const fetchGithubRepos = async () => {
  const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
};

const main = async () => {
  const snap = await getDocs(collection(db, 'projects'));

  // --- EXPORT ---
  if (MODE === 'export') {
    const docs = snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) }));
    writeFileSync(here('../projects-export.json'), JSON.stringify(docs, null, 2), 'utf8');
    console.log(`OK: ${docs.length} documentos exportados a projects-export.json`);
    process.exit(0);
  }

  const existing = new Set(snap.docs.map((d) => normUrl(d.data().githubUrl)).filter(Boolean));
  const curatedRepos = new Set(curated.map((p) => p.repo.toLowerCase()));
  const toAdd = curated.filter((p) => !existing.has(normUrl(ghUrl(p.repo))));
  const skipped = curated.filter((p) => existing.has(normUrl(ghUrl(p.repo))));

  let candidates = [];
  try {
    const repos = await fetchGithubRepos();
    candidates = repos
      .filter((r) => !r.fork && !r.archived)
      .filter((r) => !curatedRepos.has(r.name.toLowerCase()))
      .filter((r) => !existing.has(normUrl(r.html_url)))
      .map((r) => `${r.name} (${r.language || '-'}, ${r.pushed_at.slice(0, 10)})`);
  } catch (e) {
    console.warn(`Aviso: no se pudo consultar GitHub (${e.message}). Sigo sin candidatos.`);
  }

  console.log(`\n== Validacion /projects (proyecto ${env.VITE_FIREBASE_PROJECT_ID}) ==`);
  console.log(`Docs actuales: ${snap.size} | Curados: ${curated.length} | A agregar: ${toAdd.length} | Ya existen: ${skipped.length}`);

  if (toAdd.length) {
    console.log(`\nSe agregarian (${toAdd.length}):`);
    toAdd.forEach((p, i) => console.log(`  ${i + 1}. ${p.title} [${p.category}] -> ${ghUrl(p.repo)}`));
  } else {
    console.log('\nNada que agregar: la lista curada ya esta en Firebase.');
  }
  if (skipped.length) console.log(`\nOmitidos (ya existen): ${skipped.map((p) => p.repo).join(', ')}`);
  if (candidates.length) {
    console.log(`\nRepos en GitHub fuera de la lista curada (${candidates.length}) — revisa si alguno deberia entrar:`);
    candidates.forEach((c) => console.log(`  - ${c}`));
  }

  if (MODE === 'validate') {
    console.log('\n[VALIDATE] Solo lectura. Para escribir: node scripts/sync-projects.mjs --write');
    process.exit(0);
  }

  // --- WRITE ---
  if (toAdd.length === 0) { console.log('\nNada que escribir.'); process.exit(0); }
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
  for (const p of toAdd) {
    const ref = await addDoc(collection(db, 'projects'), {
      title: p.title,
      description: p.description,
      longDescription: null,
      category: p.category,
      technologies: p.technologies,
      imageUrl: null,
      demoUrl: p.demoUrl ?? null,
      githubUrl: ghUrl(p.repo),
      clientId: null,
      featured: false,
      createdAt: Timestamp.now(),
    });
    ok++;
    console.log(`  + ${p.title} (${ref.id})`);
  }
  await signOut(auth);
  console.log(`\nOK: ${ok} proyectos agregados. Corre --export para regenerar el JSON.`);
  process.exit(0);
};

main().catch((e) => { console.error('ERROR:', e.code || '', e.message); process.exit(1); });
