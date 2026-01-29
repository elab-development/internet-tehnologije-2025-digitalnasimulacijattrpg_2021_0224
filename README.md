# TTRPG SIMULATOR

## Priprema

prvo treba magicno skinuti sve dependency-je

> npm install

zatim treba pokrenuti bazu podataka, u root direktorijumu nalazi se datoteka "docker" sa komandama za kreiranje postgres kontejnera na linux-u i windows-u

kreirati .env fajl sa relevantnim podacima po .env~ template-u

nakon toga treba pokrenuti migracije

> npm run db:migrate

a postoji i seeder za svrhe testiranja

> npm run db:seed

## Pokretanje

> npm run dev
