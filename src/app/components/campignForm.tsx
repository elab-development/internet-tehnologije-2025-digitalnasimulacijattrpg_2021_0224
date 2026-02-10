import { campaign } from "../types"

interface campaignProps {
    campaign : campaign | undefined
}

export default function CampignForm({ campaign } : campaignProps) {
    console.log(campaign,"ovo je kampanja");
    const disabled = (campaign != undefined)
    return (
        <form className="flex flex-col m-2 w-1/3 items-center">
            <input
                type="text"
                placeholder="Naziv"
                defaultValue={campaign!=undefined ? campaign.name : ""}
                disabled={disabled}
            />
            <textarea 
                placeholder="Opis"
                className="mt-2"
                defaultValue={campaign!=undefined ? campaign.description : ""}
                disabled={disabled}
            />
            {disabled &&
            <label className="border mt-2">{campaign.dateStart.toString()}</label>
            }
            {!disabled &&
            <button className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
            }
        </form>
    )
}