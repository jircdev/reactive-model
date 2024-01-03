import { listen } from '@beyond-js/backend/listen';
import { createDatabase } from './hardcoded/create-database';
console.log('empezamos...');
listen();
createDatabase();
