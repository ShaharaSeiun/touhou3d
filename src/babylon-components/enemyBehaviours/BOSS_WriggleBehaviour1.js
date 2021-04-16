import { Animation, BezierCurveEase, Matrix, Quaternion, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { RandVector3, randVectorToPosition } from '../BabylonUtils';
import { AnimationContext, UIContext } from '../gameLogic/GeneralContainer';
import { allBullets } from '../gameLogic/StaticRefs';
import { useDoSequence } from '../hooks/useDoSequence';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { flattenDeep, times } from 'lodash';

const burst1 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 1, 0]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 5000,
        speeds: [4, 5, 6, 7],
        thetaLength: Math.PI * 1.1,
        thetaStart: -Math.PI/2.5
    },
    endTimings: {
        timing: 'batch',
        times: [1, 1.5, 2, 2.5]
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
}

const burst1_replace1 = (sourceId) => {
    const positions = allBullets[sourceId].behaviour.diffSystem.positionTextures[0];
    const velocities = allBullets[sourceId].velocities.map(velocity => {
        const rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI/2, 0, 0)
        const rotationMatrix = new Matrix();
        rotationQuaternion.toRotationMatrix(rotationMatrix);
        return Vector3.TransformCoordinates(velocity, rotationMatrix);
    });
    const timings = allBullets[sourceId].endTimings;

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [1, 1, 0]
        },
        patternOptions: {
            pattern: 'explicit',
            positions: positions,
            velocities: velocities,
            timings: timings
        },
        meshOptions: {
            mesh: 'egg',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
            reliesOnParent: false,
            disableWarning: true
        },
        soundOptions: {
            sound: 'enemyChangeBullet'
        },
        lifespan: 10,
        wait: 0,
    }
}

const burst2 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 1]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 5000,
        speeds: [4, 5, 6, 7],
        thetaLength: Math.PI * 1.1,
        thetaStart: Math.PI - 0.5
    },
    endTimings: {
        timing: 'batch',
        times: [1, 1.5, 2, 2.5]
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
}

const burst2_replace1 = (sourceId) => {
    const positions = allBullets[sourceId].behaviour.diffSystem.positionTextures[0];
    const velocities = allBullets[sourceId].velocities.map(velocity => {
        const rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI/2, 0, 0)
        const rotationMatrix = new Matrix();
        rotationQuaternion.toRotationMatrix(rotationMatrix);
        return Vector3.TransformCoordinates(velocity, rotationMatrix);
    });
    const timings = allBullets[sourceId].endTimings;

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0, 1, 1]
        },
        patternOptions: {
            pattern: 'explicit',
            positions: positions,
            velocities: velocities,
            timings: timings
        },
        meshOptions: {
            mesh: 'egg',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
            reliesOnParent: false,
            disableWarning: true
        },
        soundOptions: {
            sound: 'enemyChangeBullet'
        },
        lifespan: 10,
        wait: 0,
    }
}

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

export const BOSS_WriggleBehaviour1 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();
    const addBulletGroup = useAddBulletGroup();
    const { setBossUI } = useContext(UIContext)
    const { registerAnimation } = useContext(AnimationContext);

    const actionsTimings = useMemo(() => [0, ...flattenDeep(times(30, (n) => [n * 10 + 1, n * 10 + 2, n * 10 + 3]))], []);

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
            },
            ...flattenDeep(times(30, () => [
                () => {
                    moveTo(registerAnimation, transformNodeRef.current, [[-0.8, 0.8], [-0.8, 0.8], [0.8, 1.0]])
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
            ]))
        ],
        //eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name position={wriggle1StartPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
