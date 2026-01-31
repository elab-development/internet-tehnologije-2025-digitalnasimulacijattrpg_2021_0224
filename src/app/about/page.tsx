import Kockice from "../components/kockice"

export default function About() {
    return (
        <div className="flex flex-col items-center">
            <h1>O aplikaciji</h1>
            <p>neki opis i tako to</p>
            <Kockice />
            <p>autori</p>
        </div>
    );
}