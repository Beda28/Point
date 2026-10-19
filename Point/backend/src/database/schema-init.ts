import database from './data-source.js';

try {
  await database.initialize()
  const tables = await database.query('SHOW TABLES')
  if (tables.length) throw new Error('Schema initialization requires an empty database')
  await database.synchronize()
  console.log('Database schema initialized')
} catch {
  console.error('Schema initialization failed. Check connectivity and use an empty database.')
  process.exitCode = 1
} finally {
  if (database.isInitialized) await database.destroy()
}
