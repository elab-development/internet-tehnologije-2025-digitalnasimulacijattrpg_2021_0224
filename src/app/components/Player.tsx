import { user } from "../types";


interface userProps {
    u : user,
}

export default function Player({u} : userProps) {
    return (
        <div className="flex flex col border p-1">
            <p>{u.username}</p>
        </div>
    )
}