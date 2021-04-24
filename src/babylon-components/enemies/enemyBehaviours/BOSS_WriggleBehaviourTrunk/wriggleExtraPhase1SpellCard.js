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
        color: [0.9, 0.9, 0.9]
    },
    patternOptions: {
        pattern: 'sprayStableRandBurst',
        num: 200,
        timeLength: 7,
        speed: 8,
        thetaSpeed: 0.3,
        burstPerSecond: 24
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    endTimings: {
        timing: 'uniform',
        time: 2
    },
    lifespan: 20,
    wait: 0,
}

export const useWriggleExtraPhase1SpellCard = (active, transformNodeRef) => {
    const { setSpellCardUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()
    
    useEffect(() => {
        if(active){
            bossDeathQuiet.play();
            setSpellCardUI({
                character: 'wriggle', 
                spellCard: `Wriggle Sign   "Nightbug Tornado"`
            })
        }
    }, [active, setSpellCardUI])

    const addBulletGroup = useAddBulletGroup();
    const actionsTimings = useMemo(() => [0, 2, 15], []);
    const actions = useMemo(() =>
        [
            () => {
                addEffect(transformNodeRef.current, 'wriggleCharge')
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    spray
                )
                const id2 = addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(id, { rotation: Math.PI/2 }, {
                        meshOptions: {
                            mesh: 'sphere',
                            radius: 0.2
                        },
                        behaviourOptions:{
                            behaviour: 'linear'
                        },
                        endTimings: {
                            timing: 'uniform',
                            time: 1
                        },
                    })
                )
                const id3 = addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(
                        id2, 
                        {
                            rotation: 0,
                            velocityMultiplier: 0.001
                        },
                        {
                            materialOptions: {
                                material: 'fresnel',
                                color: [1, 1, 0]
                            },
                            meshOptions: {
                                mesh: 'sphere',
                                radius: 0.1
                            },
                            endTimings: {
                                timing: 'uniform',
                                time: 1
                            },
                        }
                    )
                )
                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(
                        id3, 
                        {
                            rotation: -Math.PI/2,
                            velocityMultiplier: 500
                        },
                        {
                            materialOptions: {
                                material: 'fresnel',
                                color: [1, 1, 0]
                            },
                            meshOptions: {
                                mesh: 'egg',
                                radius: 0.1
                            },
                        }
                    )
                )
                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(
                        id3, 
                        {
                            rotation: 0,
                            velocityMultiplier: 500
                        },
                        {
                            materialOptions: {
                                material: 'fresnel',
                                color: [1, 1, 0]
                            },
                            meshOptions: {
                                mesh: 'egg',
                                radius: 0.1
                            },
                        }
                    )
                )
                addBulletGroup(
                    transformNodeRef.current,
                    bulletReplaceRotation(
                        id3, 
                        {
                            rotation: Math.PI/2,
                            velocityMultiplier: 1000
                        },
                        {
                            materialOptions: {
                                material: 'fresnel',
                                color: [0, 1, 0]
                            },
                            meshOptions: {
                                mesh: 'egg',
                                radius: 0.1
                            },
                        }
                    )
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