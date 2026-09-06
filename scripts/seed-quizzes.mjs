#!/usr/bin/env node
// Load the six bundled quizzes (lib/quizzes/seed-data.js) into the `quizzes`
// table created by migration 0005.
//
//   npm run quizzes:seed             -> insert any that are missing
//   npm run quizzes:seed -- --force  -> overwrite existing rows too
//
// After this runs, lib/quizzes/index.js serves from the database; editing a
// quiz in /admin changes the DB row, not the code.

import { SEED_QUIZZES } from '../lib/quizzes/seed-data.js'
import { createAdminClient } from '../lib/supabase/admin.js'

const force = process.argv.slice(2).includes('--force')
const db = createAdminClient()

let done = 0
for (let i = 0; i < SEED_QUIZZES.length; i++) {
  const quiz = SEED_QUIZZES[i]
  const { slug } = quiz

  const { data: existing } = await db.from('quizzes').select('slug').eq('slug', slug).maybeSingle()
  if (existing && !force) {
    console.log(`  ${slug}: already present, skipping`)
    done++
    continue
  }

  const row = {
    slug,
    definition: quiz,
    image_url: quiz.image ?? null,
    status: 'published',
    sort_order: quiz.order ?? i + 1,
  }

  const { error } = await db.from('quizzes').upsert(row, { onConflict: 'slug' })
  if (error) {
    console.log(`  ${slug}: FAILED (${error.message})`)
    continue
  }
  console.log(`  ${slug}: ${existing ? 'updated' : 'inserted'}`)
  done++
}

console.log(`\n${done}/${SEED_QUIZZES.length} quizzes in the database.`)
