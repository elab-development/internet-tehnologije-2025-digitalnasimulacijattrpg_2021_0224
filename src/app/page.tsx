import Kockice from "./components/kockice";

export default function Welcome() {
    return (
        <div className="flex flex-col items-center border">
            <h1>Stranica koju vide neulogovani korisnici</h1>
            <p>*lorem ipsum*</p>
            <Kockice />
        </div>
    );
}
