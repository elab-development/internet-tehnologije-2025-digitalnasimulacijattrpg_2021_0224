import { charSheet } from "../types"

interface charSheetProps {
    char : charSheet | undefined
}

export default function CharSheetForm({ char } : charSheetProps) {
    const disabled = (char != undefined)
    return (
        <form className="flex flex-col m-2 w-1/4 items-center">
            <input 
                type="text"
                placeholder="Ime"
                defaultValue={char ? char.name : ""}
                disabled={disabled}
            />
            <div className="flex flex-row iems-center gap-5">
                <div className="flex flex-col">
                    <Polje name="STR" value={char ? char.str : ""} disabled={disabled}/>
                    <Polje name="DEX" value={char ? char.dex : ""} disabled={disabled}/>
                    <Polje name="WILL" value={char ? char.will : ""} disabled={disabled}/>
                </div>
                <div className="flex flex-col">
                    <Polje name="AR" value={char ? char.armor : ""} disabled={disabled}/>
                    <Polje name="HP" value={char ? char.hp : ""} disabled={disabled}/>
                    <Polje name="CUR" value={char ? char.currency : ""} disabled={disabled}/>
                </div>
            </div>
            {!disabled &&
            <button className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
            }
        </form>
    );
}

function Polje(props : any) {
    return (
        <div className="flex flex-row items-center mt-2 text-right justify-center">
            <p className="flex-2 mr-1">{props.name}</p>
            <input className="flex-1" defaultValue={props.value} disabled={props.disabled}></input>
        </div>
    )
}