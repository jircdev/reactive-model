import { v4 as uuidv4 } from 'uuid';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/*
 * Initialize library beyondJS backend server
 */
import { listen } from '@beyond-js/backend/listen';
import { createDatabase } from './hardcoded/create-database';

listen(6580);
console.log(400);

createDatabase();
