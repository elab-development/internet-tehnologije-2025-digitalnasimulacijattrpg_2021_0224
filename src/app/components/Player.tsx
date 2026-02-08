import { user } from "../types";


interface userProps {
    u : user,
}

export default function Player({u} : userProps) {
    return (
        <div className="flex flex col border">
            <p>{u.username}</p>
        </div>
    )
}