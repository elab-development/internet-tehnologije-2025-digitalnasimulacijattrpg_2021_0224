import "dotenv/config";
import {usersTable,charSheetsTable,campaignsTable} from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";
import { timestamp } from "drizzle-orm/gel-core";

const az = await bcrypt.hash("sifra", 10);
const rs = await bcrypt.hash("opanak", 10);
const os = await bcrypt.hash("bojler", 10);
//8277608e-63e5-4259-9eae-159d10bd110b vrednost rosiceovog ida starog
await db.transaction(async (tx) => {
    await tx.insert(usersTable).values([
        {
            id:"00000000-0000-0000-0000-000000000000",
            username: "zli4leksa",
            password: az,
        },
        {
            id:"00000000-0000-0000-0000-000000000001",
            username: "ignjat",
            password: os,
        },
        {
            id:"00000000-0000-0000-0000-000000000003",
            username: "horrorrosic",
            password: rs,
        }
    ]);
});

await db.transaction(async (tx) => {
    await tx.insert(charSheetsTable).values([
       {
            id:"00000000-0000-0000-0000-00000000000a",
            name:"DARKO",
            str : 90000,
            dex : 123123,
            will : 123124,
            armor : 12,
            hp : 1,
            currency : 4,
            owner : "00000000-0000-0000-0000-000000000003", 
       },
        {
            id:"00000000-0000-0000-0000-00000000000b",
            name:"ZARKO",
            str : 90000,
            dex : 123123,
            will : 123124,
            armor : 12,
            hp : 1,
            currency : 4,
            owner : "00000000-0000-0000-0000-000000000003", 
       },
        {
            id:"00000000-0000-0000-0000-00000000000c",
            name:"MARKO",
            str : 90000,
            dex : 123123,
            will : 123124,
            armor : 12,
            hp : 1,
            currency : 4,
            owner : "00000000-0000-0000-0000-000000000003", 
       }
       
    ]);
});
await db.transaction(async (tx) => {
    await tx.insert(campaignsTable).values([
        {
            id : "00000000-0000-0000-0000-100000000000",
                name : "Odpopavljivanje Obrenovca",
                description : "Rosic i njegova porodica se nalaze na krovu i nemogu da pobegnu od navale vode koja dolazi sa Kolubare. Celo Topolice je pod vodom, nadjite nacin da oslobodite Gorana, Gabrijelu, Strahinju i Rosica od ove nezgode",
                gameMaster : "00000000-0000-0000-0000-000000000003"
        },
        {
            id : "00000000-0000-0000-0000-200000000000",
                name : "Borba za Baric",
                description:"Namuceni ljudi koji sebe nazivaju brdjanima su digli revoluciju protiv vladajuce bande u Baricu koja se zove BK(Baricki korpus) nakon bitke ispod mosta lideri revolucije Kosta i Djole su vodili ljude uz Baricki potok nazad do brda. Pomozite ugnjetavanim revolucionarima da vrate nazad svoju slobodu i svrgnu KB s tiranske stolice",
                gameMaster : "00000000-0000-0000-0000-000000000003"
        },
        {
            id : "00000000-0000-0000-0000-300000000000",
                name : "Zemljani Moreplovci",
                description:"Senjor Gutesa je uzivao u svojoj jutarnjoj kavi kada se oglasio njegov radar za zle sile.SAMO VI MU MOZETE POMOCI DA NAS SACUVA OD ZLOTVORA!",
                gameMaster : "00000000-0000-0000-0000-000000000000"
        },
        {
            id : "00000000-0000-0000-0000-400000000000",
                name : "Nikola prica gluposti",
                description:"Nikola je poslednji covek koji je video cepanje raja, nazalost to mu je dalo slog. Sada je krenuo da prica totalno ne povezane stvari. MEdjutim Gajaka je nasao patern u njihovim dijalozima i skontao je da je moguca konverzacija s njim. Saznaj sta je Nikola video s druge strane nebeskih zavesa!",
                gameMaster : "00000000-0000-0000-0000-000000000000"
        }
        
    ]);
});

process.exit(0);