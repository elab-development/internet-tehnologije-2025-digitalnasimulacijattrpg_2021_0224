export default function CharSheetForm() {
    return (
        <form className="flex flex-col m-2 w-1/4 items-center">
            <input 
                type="text"
                placeholder="Ime"
            />
            <div className="flex flex-row iems-center gap-5">
                <div className="flex flex-col">
                    <Polje name="STR" />
                    <Polje name="DEX" />
                    <Polje name="WILL" />
                </div>
                <div className="flex flex-col">
                    <Polje name="AR" />
                    <Polje name="HP" />
                    <Polje name="CUR" />
                </div>
            </div>
            <button className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
        </form>
    )
}

function Polje(props : any) {
    return (
        <div className="flex flex-row items-center mt-2 text-right justify-center">
            <p className="flex-2 mr-1">{props.name}</p>
            <input className="flex-1"></input>
        </div>
    )
}