import { UUID } from "crypto";

export enum fileType {
    pdf,
    png,
    jpeg,
}

export type user = {
    id : UUID,
    username: string,
}

export type campaign = {
    id : UUID,
    name : string,
    description : string,
    dateStart : Date,
    gameMaster : user, 
}

export type document = {
    id : UUID,
    name : string,
    type : fileType,
    filepath : string,
}

export type charSheet = {
    id : UUID,
    name : string,
    str : number,
    dex : number,
    will : number,
    armor : number,
    hp : number,
    currency : number,
    owner : user , 
}

export type note = {
    id : UUID,
    content : string,
    writtenIn : charSheet,
}