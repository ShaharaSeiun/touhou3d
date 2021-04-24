import { useContext, useEffect, useMemo } from "react";
import { bossDeathQuiet } from "../../../../sounds/SFX";
import { bulletReplaceRotation } from "../../../bullets/BulletUtils";
import { AnimationContext, UIContext } from "../../../gameLogic/GeneralContainer";
import { useAddBulletGroup } from "../../../hooks/useAddBulletGroup";
import { useAddEffect } from "../../../hooks/useAddEffect";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { moveTo } from "../BehaviourCommon";

const spray = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 0]
    },
    patternOptions: {
        pattern: 'sprayStableRandBurst',
        num: 300,
        timeLength: 7,
        speed: 12
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const spray2 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 1]
    },
    patternOptions: {
        pattern: 'sprayStableRandBurst',
        num: 300,
        timeLength: 7,
        speed: 15
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
    endTimings: {
        timing: 'uniform',
        time: 2
    },
}

export const useWrigglePhase1SpellCard = (active, transformNodeRef) => {
    const { setSpellCardUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()
    
    useEffect(() => {
        if(active){
            bossDeathQuiet.play();
            setSpellCardUI({
                character: 'wriggle', 
                spellCard: `Lamp Sign   "Firefly Phenomenon"`
            })
        }
    }, [active, setSpellCardUI])

    const addBulletGroup = useAddBulletGroup();
    const actionsTimings = useMemo(() => [0, 2, 11], []);
    const actions = useMemo(() =>
        [
            () => {
                addEffect(transformNodeRef.current, 'wriggleCharge')
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    spray
                )
                const id = addBulletGroup(
                    transformNodeRef.current,
                    spray2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(id, { rotation: Math.PI/3 }, {
                        behaviourOptions:{
                            behaviour: 'linear'
                        } 
                    })
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(active, transformNodeRef, actionsTimings, actions, true);
}