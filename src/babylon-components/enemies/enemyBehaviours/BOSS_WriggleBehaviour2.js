import { Vector3 } from '@babylonjs/core';
import { flattenDeep } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import Music from '../../../sounds/Music';
import { RotateAndShootMinionDef } from '../../../stages/common/RotateAndShootMinionDef';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext, BulletsContext, UIContext } from '../../gameLogic/GeneralContainer';
import { globalActorRefs } from '../../gameLogic/StaticRefs';
import { Enemies } from '../Enemies';
import { makeActionListTimeline } from '../EnemyUtils';
import { moveTo } from "./BehaviourCommon";
import { useWriggleExtraPhase1SpellCard } from './BOSS_WriggleBehaviourTrunk/wriggleExtraPhase1SpellCard';
import { useWrigglePhase1Normal } from './BOSS_WriggleBehaviourTrunk/wrigglePhase1Normal';
import { useWrigglePhase1SpellCard } from './BOSS_WriggleBehaviourTrunk/wrigglePhase1SpellCard';
import { useWrigglePhase2Normal } from './BOSS_WriggleBehaviourTrunk/wrigglePhase2Normal';
import { useWrigglePhase2SpellCard } from './BOSS_WriggleBehaviourTrunk/wrigglePhase2SpellCard';


const wriggle1StartPosition = randVectorToPosition([9, 1, 3])



const enemiesInstructions = []

enemiesInstructions.push({
    type: "enemies",
    action: 'empty',
    wait: 1
})


enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(0.1, 0, 0) }),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(-0.1, 0, 0), reverse: true }),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(0.1, 0.1, 0) }),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({ color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(-0.1, 0.1, 0), reverse: true }),
    wait: 0
})

const enemiesActionList = makeActionListTimeline(enemiesInstructions);

const lives = [
    {
        healthStart: 1000,
        healthEnd: 0,
        spellCards: [500]
    },
]

const phases = flattenDeep(lives.map(life => {
    return [0, life.spellCards.map(spellCard => spellCard + life.healthEnd).reverse()].reverse();
}))

export const BOSS_WriggleBehaviour2 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();

    const { setBossUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const { clearAllBullets } = useContext(BulletsContext);
    const [epoch, setEpoch] = useState(0);


    useEffect(() => {
        Music.play("wriggleTheme")
        setBossUI({
            bossName: "wriggle",
            lives
        })
        moveTo(registerAnimation, transformNodeRef.current, [0, 0, 1])

        return () => {
            // window.setTimeout(() => {
            //     window.location.href = "https://www.youtube.com/watch?v=oyFQVZ2h0V8"
            // }, 5000)
        }
    }, [registerAnimation, setBossUI])

    useEffect(() => {
        clearAllBullets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [epoch])

    useWrigglePhase1Normal(epoch === 1, transformNodeRef)
    useWrigglePhase1SpellCard(epoch === 2, transformNodeRef)
    useWrigglePhase2Normal(epoch === 2, transformNodeRef)
    useWrigglePhase2SpellCard(epoch === 0, transformNodeRef)
    useWriggleExtraPhase1SpellCard(epoch === 5, transformNodeRef)

    useBeforeRender(() => {
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
            <Enemies currentActionList={enemiesActionList} />
            {children}

        </transformNode>
    );
};
