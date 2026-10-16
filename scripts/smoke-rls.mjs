// RLS-Smoke-Test: prüft mit dem öffentlichen anon-Key, dass
//  0. der Key gültig ist und die Tabelle erreichbar,
//  1. Einreichen (pending) erlaubt ist,
//  2. pending-Beiträge NICHT öffentlich lesbar sind,
//  3. ein Einreichen als «approved» abgelehnt wird (RLS).
//
// Aufruf:  node --env-file=.env scripts/smoke-rls.mjs
//
// Hinweis: Prüfung 1 legt eine echte pending-Zeile an. Da anon nicht
// löschen darf, im Supabase-Dashboard wieder entfernen.

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Fehlend: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Mit --env-file=.env starten.')
  process.exit(1)
}

const supabase = createClient(url, key)
let fehler = 0

function pruefe(name, ok, detail = '') {
  console.log(`${ok ? 'OK  ' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
  if (!ok) fehler++
}

// 0. Key gültig / Tabelle erreichbar
const { error: pingErr } = await supabase.from('beitraege').select('id').limit(1)
if (pingErr) {
  pruefe('API erreichbar und Key gültig', false, pingErr.message)
  console.log('\nAbbruch: Key ungültig oder Tabelle fehlt.')
  process.exit(1)
}
pruefe('API erreichbar und Key gültig', true)

// 1. Einreichen als pending erlaubt (ohne RETURNING – anon darf pending nicht lesen)
const pfad = `pending/smoke-${Date.now()}.jpg`
const { error: insertErr } = await supabase
  .from('beitraege')
  .insert({ kategorie: 'autos', menge: 1, einreicher: '__smoke__', foto_pfad: pfad, status: 'pending' })

pruefe('Einreichen (pending) erlaubt', !insertErr, insertErr?.message)

// 2. pending ist öffentlich nicht lesbar (ohne Fehler, einfach unsichtbar)
const { data: sichtbar, error: selErr } = await supabase.from('beitraege').select('id, einreicher')

pruefe(
  'pending nicht öffentlich lesbar',
  !selErr && !(sichtbar ?? []).some((r) => r.einreicher === '__smoke__'),
  selErr?.message,
)

// 3. Einreichen als approved wird von RLS abgelehnt (nicht von einem Auth-Fehler)
const { error: approvedErr } = await supabase
  .from('beitraege')
  .insert({ kategorie: 'autos', menge: 1, foto_pfad: pfad, status: 'approved' })

const istPolicyFehler =
  !!approvedErr && (approvedErr.code === '42501' || /row-level security|violates/i.test(approvedErr.message))
pruefe('Einreichen als «approved» abgelehnt (RLS)', istPolicyFehler, approvedErr?.message ?? 'unerwartet erlaubt')

// 4. Bucket lehnt Nicht-Bilder ab (allowed_mime_types)
const pdf = new Blob([new Uint8Array(16)], { type: 'application/pdf' })
const { error: pdfErr } = await supabase.storage
  .from('fotos')
  .upload(`pending/smoke-${Date.now()}.pdf`, pdf, { contentType: 'application/pdf' })
pruefe('Bucket lehnt Nicht-Bilder ab', !!pdfErr, pdfErr ? '' : 'unerwartet erlaubt')

// 5. Bucket lehnt zu grosse Dateien ab (file_size_limit)
const gross = new Blob([new Uint8Array(11 * 1024 * 1024)], { type: 'image/jpeg' })
const { error: grossErr } = await supabase.storage
  .from('fotos')
  .upload(`pending/smoke-${Date.now()}-gross.jpg`, gross, { contentType: 'image/jpeg' })
pruefe('Bucket lehnt zu grosse Dateien ab', !!grossErr, grossErr ? '' : 'unerwartet erlaubt')

console.log(fehler === 0 ? '\nOK' : `\n${fehler} Prüfung(en) fehlgeschlagen`)
process.exit(fehler === 0 ? 0 : 1)
