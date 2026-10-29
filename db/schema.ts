import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const memberScopes=sqliteTable('member_scopes',{email:text('email').primaryKey(),json:text('json').notNull()});
export const appState=sqliteTable('app_state',{id:text('id').primaryKey(),json:text('json').notNull(),version:integer('version').notNull().default(0),lastCommand:text('last_command')});
export const members=sqliteTable('members',{id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),team:text('team').notNull(),roles:text('roles').notNull(),owner:integer('owner').notNull().default(0)});
export const auditEvents=sqliteTable('audit_events',{id:text('id').primaryKey(),requestId:text('request_id').notNull().unique(),actor:text('actor').notNull(),time:text('time').notNull(),action:text('action').notNull(),result:text('result').notNull()});
export const storedFiles=sqliteTable('stored_files',{id:text('id').primaryKey(),owner:text('owner').notNull(),key:text('object_key').notNull(),name:text('name').notNull(),type:text('type').notNull(),size:integer('size').notNull(),created:text('created').notNull(),kind:text('kind').notNull()});
export const draftRecords=sqliteTable('draft_records',{id:text('id').primaryKey(),owner:text('owner').notNull(),json:text('json').notNull(),updated:text('updated').notNull()});
