import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext, UIContext } from '../../gameLogic/GeneralContainer';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import Music from '../../../sounds/Music';
import { burst1, burst1_replace1, burst2, burst2_replace1} from "./BOSS_WriggleBehaviourCommon";
import { RotateAndShootMinionDef } from '../../../stages/common/RotateAndShootMinionDef';
import { makeActionListTimeline } from '../EnemyUtils';
import { Enemies } from '../Enemies';
import { useAddEffect } from '../../hooks/useAddEffect';

const pincer1 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 1]
    },
    patternOptions: {
        pattern: 'multiArea',
        speeds: [2, 3, 4, 5, 6, 7],
        num: 5,
        radialAngle: Math.PI/4,
        offset: [-0.1, 0, 0],
        towardsPlayer: true
    },
    endTimings: {
        timing: 'uniform',
        time: 1
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}

const wriggle1StartPosition = randVectorToPosition([9, 1, 3])

const moveTo = (registerAnimation, transform, target) => {
    const targetVector = randVectorToPosition(target);
    let easingFunction = new BezierCurveEase(0.03, 0.66, 0.72, 0.98);
    registerAnimation(
        Animation.CreateAndStartAnimation(
            'anim',
            transform,
            'position',
            1,
            1,
            transform.position,
            targetVector,
            0,
            easingFunction
        )
    );
}

const enemiesInstructions = []

enemiesInstructions.push({
    type: "enemies",
    action: 'empty',
    wait: 12
})


enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(0.1, 0, 0)}),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(-0.1, 0, 0), reverse: true}),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(0.1, 0.1, 0)}),
    wait: 0
})
enemiesInstructions.push({
    type: "enemies",
    action: 'spawn',
    enemy: RotateAndShootMinionDef({color: [1, 1, 0], targetDist: 3, armTime: 1, spawn: new Vector3(-0.1, 0.1, 0), reverse: true}),
    wait: 0
})

const enemiesActionList = makeActionListTimeline(enemiesInstructions);

export const BOSS_WriggleBehaviour2 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();
    const addBulletGroup = useAddBulletGroup();
    const { setBossUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);
    const addEffect = useAddEffect()

    const actionsTimings = useMemo(() => [0, 1, 2, 3, 4, 10], []);

    const actions = useMemo(() =>
        [
            () => {
                setBossUI({
                    bossName: "wriggle",
                    lives: [
                        {
                            healthStart: 1000,
                            healthEnd: 0,
                            spellCards: [500, 100]
                        },
                    ]
                })
                moveTo(registerAnimation, transformNodeRef.current, [0, 0, 1])
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    burst1_replace1(id)
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst2
                )
                addBulletGroup(
                    transformNodeRef.current,
                    burst2_replace1(id)
                )
            },
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    burst1
                )

                addBulletGroup(
                    transformNodeRef.current,
                    burst1_replace1(id)
                )
            },
            () => {
                moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
            },
            () => {
                addEffect(transformNodeRef.current, 'wriggleCharge')
            },
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        Music.play("wriggleTheme")

        return () => {
            // window.setTimeout(() => {
            //     window.location.href = "https://www.youtube.com/watch?v=oyFQVZ2h0V8"
            // }, 5000)
        }
    }, [])

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name position={wriggle1StartPosition} ref={transformNodeRef}>
            <Enemies currentActionList={enemiesActionList} />
            {children}
            
        </transformNode>
    );
};
