import Kockice from "./components/kockice";

export default function Welcome() {
    return (
        <div className="welcome_div">
            <h1 className="welcomeH">
                ⚔🔥TTRPG SIMULATOR🔥⚔
            </h1>
            <p className="welcomeText">Volite TTRPG igre, ali nemate dovoljno vremena da ih igrate uživo?
            <br/> Rešenje je na samo jedan klik od vas, <span className="highlight"> PRIJAVITE SE SADA!</span> 
            </p>
            <div className="imageDiv">
                <img src="/images/welcomeBG/welcomeImg.jpg" alt="Welcome background image" width="300" height="300" 
                style={{opacity: 0.88}} className="contentImg" />
            </div >
            <Kockice/>
        </div>
    );
}
