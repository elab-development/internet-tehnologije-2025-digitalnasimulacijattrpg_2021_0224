import { note } from "../../../../server"


interface noteProps {
  n : note | undefined
}

export default function NoteDisplay({n} : noteProps) {
  return (
    <div className="flex flex-col bg-black border p-1 gap-1">
        <p>{n?.content}</p>
    </div>
  )
}