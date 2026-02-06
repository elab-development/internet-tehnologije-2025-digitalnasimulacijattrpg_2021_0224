export default function CampignForm() {
    return (
        <form className="flex flex-col m-2 w-1/3 items-center">
            <input
                type="text"
                placeholder="Naziv"
            />
            <textarea 
                placeholder="Opis"
                className="mt-2"
            />
            <button className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
        </form>
    )
}