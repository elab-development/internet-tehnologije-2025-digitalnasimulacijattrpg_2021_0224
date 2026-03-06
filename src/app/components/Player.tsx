import { player } from "../../../server";
import { user } from "../types";


interface userProps {
    p: player,
}

export default function Player({p} : userProps) {
    return (
        <div className="flex flex-col border p-1 gap-1 bg-black">
            <p className="border pl-2 pr-2">{p.username}</p>
            <p className="border pl-2 pr-2">{p.charSheet.name}</p>
        </div>
    )
}