import "dotenv/config";
import {usersTable,charSheetsTable,campaignsTable,campaignPlayersTable, campaignPlayersCharSheetsTable, notesTable} from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const az = await bcrypt.hash("sifra", 10);
const rs = await bcrypt.hash("opanak", 10);
const os = await bcrypt.hash("bojler", 10);

await db.transaction(async (tx) => {

    await tx.insert(usersTable).values([
        {
            id:"aaaaaaaa-0000-0000-0000-000000000000",
            username: "zli4leksa",
            password: az,
        },
        {
            id:"aaaaaaaa-0000-0000-0000-000000000001",
            username: "ignjat",
            password: os,
        },
        {
            id:"aaaaaaaa-0000-0000-0000-000000000002",
            username: "horrorrosic",
            password: rs,
        }
    ]).onConflictDoNothing();

    await tx.insert(charSheetsTable).values([
        {
            id:"bbbbbbbb-0000-0000-0000-000000000000",
            name:"DARKO",
            str : 90000,
            dex : 123123,
            will : 123124,
            armor : 12,
            hp : 1,
            currency : 4,
            owner : "aaaaaaaa-0000-0000-0000-000000000002", 
        },
        {
            id:"bbbbbbbb-0000-0000-0000-000000000001",
            name:"ZARKO",
            str : 90000,
            dex : 123123,
            will : 123124,
            armor : 12,
            hp : 1,
            currency : 4,
            owner : "aaaaaaaa-0000-0000-0000-000000000002", 
        },
        {
            id:"bbbbbbbb-0000-0000-0000-000000000002",
            name:"MARKO",
            str : 90000,
            dex : 123123,
            will : 123124,
            armor : 12,
            hp : 1,
            currency : 4,
            owner : "aaaaaaaa-0000-0000-0000-000000000002", 
        },
        {
            id:"bbbbbbbb-0000-0000-0000-000000000003",
            name:"Slavoljubomir",
            str : 16,
            dex : 8,
            will : 13,
            armor : 10,
            hp : 10,
            currency : 2,
            owner : "aaaaaaaa-0000-0000-0000-000000000001", 
        },
        {
            id:"bbbbbbbb-0000-0000-0000-000000000004",
            name:"bingus",
            str : 13,
            dex : 18,
            will : 5,
            armor : 10,
            hp : 10,
            currency : 7,
            owner : "aaaaaaaa-0000-0000-0000-000000000000", 
        },
    ]).onConflictDoNothing();

    await tx.insert(campaignsTable).values([
        {
            id : "cccccccc-0000-0000-0000-000000000000",
            name : "Odpopavljivanje Obrenovca",
            description : "Rosic i njegova porodica se nalaze na krovu i nemogu da pobegnu od navale vode koja dolazi sa Kolubare. Celo Topolice je pod vodom, nadjite nacin da oslobodite Gorana, Gabrijelu, Strahinju i Rosica od ove nezgode",
            gameMaster : "aaaaaaaa-0000-0000-0000-000000000002"
        },
        {
            id : "cccccccc-0000-0000-0000-000000000001",
            name : "Borba za Baric",
            description:"Namuceni ljudi koji sebe nazivaju brdjanima su digli revoluciju protiv vladajuce bande u Baricu koja se zove BK(Baricki korpus) nakon bitke ispod mosta lideri revolucije Kosta i Djole su vodili ljude uz Baricki potok nazad do brda. Pomozite ugnjetavanim revolucionarima da vrate nazad svoju slobodu i svrgnu KB s tiranske stolice",
            gameMaster : "aaaaaaaa-0000-0000-0000-000000000002"
        },
        {
            id : "cccccccc-0000-0000-0000-000000000002",
            name : "Zemljani Moreplovci",
            description:"Senjor Gutesa je uzivao u svojoj jutarnjoj kavi kada se oglasio njegov radar za zle sile.SAMO VI MU MOZETE POMOCI DA NAS SACUVA OD ZLOTVORA!",
            gameMaster : "aaaaaaaa-0000-0000-0000-000000000000"
        },
        {
            id : "cccccccc-0000-0000-0000-000000000003",
            name : "Nikola prica gluposti",
            description:"Nikola je poslednji covek koji je video cepanje raja, nazalost to mu je dalo slog. Sada je krenuo da prica totalno ne povezane stvari. MEdjutim Gajaka je nasao patern u njihovim dijalozima i skontao je da je moguca konverzacija s njim. Saznaj sta je Nikola video s druge strane nebeskih zavesa!",
            gameMaster : "aaaaaaaa-0000-0000-0000-000000000000"
        }
    ]).onConflictDoNothing();

    await tx.insert(campaignPlayersTable).values([
        {
            capmaign: "cccccccc-0000-0000-0000-000000000003",
            player: "aaaaaaaa-0000-0000-0000-000000000002"
        },
        {
            capmaign: "cccccccc-0000-0000-0000-000000000002",
            player: "aaaaaaaa-0000-0000-0000-000000000002"
        },
        {
            capmaign: "cccccccc-0000-0000-0000-000000000000",
            player: "aaaaaaaa-0000-0000-0000-000000000001"
        },
        {
            capmaign: "cccccccc-0000-0000-0000-000000000000",
            player: "aaaaaaaa-0000-0000-0000-000000000000"
        },
    ]).onConflictDoNothing();

    await tx.insert(campaignPlayersCharSheetsTable).values([
        {
            campaign: "cccccccc-0000-0000-0000-000000000000",
            player: "aaaaaaaa-0000-0000-0000-000000000001",
            charSheet:"bbbbbbbb-0000-0000-0000-000000000003"
        },
        {
            campaign: "cccccccc-0000-0000-0000-000000000000",
            player: "aaaaaaaa-0000-0000-0000-000000000000",
            charSheet:"bbbbbbbb-0000-0000-0000-000000000004"
        },
    ]).onConflictDoNothing();

    await tx.insert(notesTable).values([
        {
            id: "dddddddd-0000-0000-0000-000000000000",
            content: "zli aleksa je zao",
            writtenIn: "bbbbbbbb-0000-0000-0000-000000000003",
        },
        {
            id: "dddddddd-0000-0000-0000-000000000001",
            content: "hladi mi se cips",
            writtenIn: "bbbbbbbb-0000-0000-0000-000000000003",
        },
        {
            id: "dddddddd-0000-0000-0000-000000000002",
            content: "zlokobno kujem svoje zle planove...",
            writtenIn: "bbbbbbbb-0000-0000-0000-000000000004",
        },
    ]).onConflictDoNothing();

    // eeeeeeee za dokumenta

});

process.exit(0);