import { charSheet } from "../../../../server"


interface charSheetProps {
  cs : charSheet | undefined
}

export default function CharSheetDisplay({cs} : charSheetProps) {
  return (
    <div className="bg-black border p-1 text-center">
      <p className="border p-1 text-center font-bold mb-1">{cs?.name}</p>
      <div className="flex flex-row justify-evenly gap-1">
        <div className="flex flex-col gap-1 w-1/2">
          <p className="csdata border p-1 w-auto">str {cs?.str}</p>
          <p className="csdata border p-1 w-auto">dex {cs?.dex}</p>
          <p className="csdata border p-1 w-auto">will {cs?.will}</p>
        </div>
        <div className="flex flex-col gap-1 w-1/2">
          <p className="csdata border p-1 w-auto">ar {cs?.armor}</p>
          <p className="csdata border p-1 w-auto">hp {cs?.hp}</p>
          <p className="csdata border p-1 w-auto">cur {cs?.currency}</p>
        </div>
      </div>
    </div>
  )
}