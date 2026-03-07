import { player } from "../../../../server";


interface userProps {
    p: player,
}

export default function Player({p} : userProps) {
    return (
        <div className={`flex flex-col border p-1 gap-1 text-center
            ${ p.online
                ? "bg-black text-white"
                : "bg-pink-900 text-pink-950"
            }`
        }>
            <p className="border pl-2 pr-2 font-bold">{p.charSheet?.name}</p>
            <p className="border pl-2 pr-2">{p.username}</p>
        </div>
    )
}