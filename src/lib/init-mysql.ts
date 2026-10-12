import { initDatabase } from './mysql';

async function main() {
  console.log('Connecting to XAMPP MySQL and initializing database...');
  await initDatabase();
  console.log('Database initialization completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
