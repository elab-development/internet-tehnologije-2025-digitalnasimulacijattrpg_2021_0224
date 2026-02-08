import Kockice from "../components/kockice"

export default function About() {
    return (
        <div className="flex flex-col items-center border">
            <h1 className="naslovAbout">O aplikaciji</h1>
            <p className="aboutIdeja">Jedne pozne večeri decembra meseca 2025.godine kada smo razmišljali o 
                krucijalnim problemima čovekove egzistencije došli smo do zaključka da je čovečanstvu 
                potrebna jos jedna live service aplikacija. Ovo ne bi bila obična live service aplikacija,
                ovo bi bio plod naše muke i bolova sjedinjeno sa primalnom potrebom čoveka za bacanje kockica.
                Zajedničkim snagama prkosimo tišini prisutnoj unutar naših glava, praveći još jedan izgovor da 
                crpimo naše dragoceno vreme u ovom prolaznom postojanju. 
            </p>
            <p className="autori">Autori: <br />  Živković "Zli" Aleksa <br/>
                       Sretenović "Оњг" Ognjen <br/>
                       Rosić "Rosić" Luka 
            </p>
            <Kockice />
        </div>
    );
}