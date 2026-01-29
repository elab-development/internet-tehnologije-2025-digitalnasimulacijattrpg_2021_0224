import { pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("User_username_unique").on(table.username),
]);
