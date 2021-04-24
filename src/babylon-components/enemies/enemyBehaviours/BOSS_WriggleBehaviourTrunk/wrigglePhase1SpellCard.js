import { useContext, useEffect } from "react";
import { UIContext } from "../../../gameLogic/GeneralContainer";


export const useWrigglePhase1SpellCard = (active, transformNodeRef) => {
    const { setSpellCardUI } = useContext(UIContext)
    
    useEffect(() => {
        if(active){
            setSpellCardUI('wriggle', `Lamp Sign   "Firefly Phenomenon"`)
        }
    }, [active, setSpellCardUI])
}