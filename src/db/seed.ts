import "dotenv/config";
import { usersTable } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const az = await bcrypt.hash("sifra", 10);
const rs = await bcrypt.hash("sifra", 10);
const os = await bcrypt.hash("bojler", 10);

await db.transaction(async (tx) => {
    await tx.insert(usersTable).values([
        {
            username: "zli4leksa",
            password: az,
        },
        {
            username: "ignjat",
            password: rs,
        },
        {
            username: "horrorrosic",
            password: os,
        }
    ]);
});

process.exit(0);