import { flattenDeep } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import Music from '../../../sounds/Music';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext, BulletsContext, UIContext } from '../../gameLogic/GeneralContainer';
import { globalActorRefs, globalCallbacks } from '../../gameLogic/StaticRefs';
import { useAddEffect } from '../../hooks/useAddEffect';
import { moveTo } from "./BehaviourCommon";
import { useWrigglePhase1Normal } from './BOSS_WriggleBehaviourTrunk/wrigglePhase1Normal';
import { useWrigglePhase1SpellCard } from './BOSS_WriggleBehaviourTrunk/wrigglePhase1SpellCard';
import { useWrigglePhase2Normal } from './BOSS_WriggleBehaviourTrunk/wrigglePhase2Normal';
import { useWrigglePhase2SpellCard } from './BOSS_WriggleBehaviourTrunk/wrigglePhase2SpellCard';


const wriggle1StartPosition = randVectorToPosition([9, 1, 3])



// const enemiesInstructions = []

// enemiesInstructions.push({
//     type: "enemies",
//     action: 'empty',
//     wait: 1
// })


// enemiesInstructions.push({
//     type: "enemies",
//     action: 'spawn',
//     enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(0.1, 0, 0) }),
//     wait: 0
// })
// enemiesInstructions.push({
//     type: "enemies",
//     action: 'spawn',
//     enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(-0.1, 0, 0), reverse: true }),
//     wait: 0
// })
// enemiesInstructions.push({
//     type: "enemies",
//     action: 'spawn',
//     enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(0.1, 0.1, 0) }),
//     wait: 0
// })
// enemiesInstructions.push({
//     type: "enemies",
//     action: 'spawn',
//     enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(-0.1, 0.1, 0), reverse: true }),
//     wait: 0
// })

// const enemiesActionList = makeActionListTimeline(enemiesInstructions);

const lives = [
    {
        healthStart: 12000,
        healthEnd: 6000,
        spellCards: [9000]
    },
    {
        healthStart: 6000,
        healthEnd: 0,
        spellCards: [3000]
    },
]

const phases = flattenDeep(lives.map(life => (
    [life.spellCards, life.healthEnd]
)))

export const BOSS_WriggleBehaviour2 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();

    const { setBossUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const { clearAllBullets } = useContext(BulletsContext);
    const addEffect = useAddEffect()
    const [epoch, setEpoch] = useState(-1);

    useEffect(() => {
        moveTo(registerAnimation, transformNodeRef.current, [0, 0, 1])
        globalCallbacks.bossStart = () => setEpoch(0)
    }, [registerAnimation])

    useEffect(() => {
        addEffect(transformNodeRef.current, {
            type: 'particles',
            name: "newPhaseWriggle",
            duration: 200
        })
        if (epoch === 0) {
            Music.play("wriggleTheme")
            setBossUI({
                bossName: "wriggle",
                lives
            })
        }
        if (epoch > 0) {
        }
    }, [registerAnimation, setBossUI, epoch, addEffect])

    useEffect(() => {
        clearAllBullets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [epoch])

    useWrigglePhase1Normal(epoch === 0, transformNodeRef)
    useWrigglePhase1SpellCard(epoch === 1, transformNodeRef)
    useWrigglePhase2Normal(epoch === 2, transformNodeRef)
    useWrigglePhase2SpellCard(epoch === 3, transformNodeRef)

    useBeforeRender(() => {
        if (epoch === -1) return;
        const bossHealth = globalActorRefs.enemies[0].health;

        let curPhase = 0;
        for (let i = 0; i < phases.length; i++) {
            if (bossHealth > phases[i]) {
                curPhase = i;
                break;
            }
        }

        if (curPhase !== epoch) {
            setEpoch(curPhase);
        }
    })

    return (
        <transformNode name position={wriggle1StartPosition} ref={transformNodeRef}>
            {children}

        </transformNode>
    );
};
