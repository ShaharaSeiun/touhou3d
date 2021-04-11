import { Animation, BezierCurveEase, Matrix, Quaternion, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../BabylonUtils';
import { AnimationContext, UIContext } from '../gameLogic/GeneralContainer';
import { allBullets, globalActorRefs } from '../gameLogic/StaticRefs';
import { useDoSequence } from '../hooks/useDoSequence';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';

const burst1 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 1, 0]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 1000,
        speeds: [2, 3, 4, 5],
        thetaLength: Math.PI * 1.1,
        thetaStart: -Math.PI/2.5
    },
    endTimings: {
        timing: 'batch',
        times: [1, 1.5, 2, 2.5]
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}

const burst1_replace1 = (sourceId) => {
    const positions = allBullets[sourceId].behaviour.positionTexture1;
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
            radius: 0.1
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
        num: 1000,
        speeds: [2, 3, 4, 5],
        thetaLength: Math.PI * 1.1,
        thetaStart: Math.PI - 0.5
    },
    endTimings: {
        timing: 'batch',
        times: [1, 1.5, 2, 2.5]
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}

const burst2_replace1 = (sourceId) => {
    const positions = allBullets[sourceId].behaviour.positionTexture1;
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
            radius: 0.1
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

const wriggle1StartPosition = randVectorToPosition([0, 0, 1])

export const BOSS_WriggleBehaviour1 = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const { setBossUI } = useContext(UIContext)

    const actionsTimings = useMemo(() => [0, 2, 3], []);

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
            }
        ],
        []
    );

    useDoSequence(true, actionsTimings, actions);

    return (
        <transformNode name position={wriggle1StartPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
