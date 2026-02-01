import { integer, numeric, timestamp, pgTable, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";

export const filetypeEnum = pgEnum('filetype', ['pdf', 'png', 'jpeg'])

export const usersTable = pgTable("User", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const campaignsTable = pgTable("Campaign", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  dateStart: timestamp().defaultNow(),
});

export const documentsTable = pgTable("Document", {
  id: uuid().primaryKey().defaultRandom(),
  type: filetypeEnum().notNull(),
  filepath: varchar({ length: 255 }).notNull(),
})

export const charSheetsTable = pgTable("CharSheet", {
  id: uuid().primaryKey().defaultRandom(),
  str: integer().notNull(),
  dex: integer().notNull(),
  will: integer().notNull(),
  armor: integer().notNull(),
  hp: integer().notNull(),
  currency: numeric().notNull(),
})

export const notesTable = pgTable("Note", {
  id: uuid().primaryKey().defaultRandom(),
  content: varchar({ length: 255 })
})