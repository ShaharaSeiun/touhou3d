import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { globalActorRefs } from '../../gameLogic/StaticRefs';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useName } from '../../hooks/useName';

const smallTowardsPlayer = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'single',
        towardsPlayer: true,
        speed: 8,
        position: [0, 0, 0]
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

const mediumTowardsPlayer = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 0, 0]
    },
    patternOptions: {
        pattern: 'single',
        towardsPlayer: true,
        speed: 8,
        position: [0, 0, 0]
    },
    meshOptions: {
        mesh: 'sphereWithHalo',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const DefaultFairyBehaviour = ({ children, leaveScene, spawn }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => new Vector3(0, 0, 0), []);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("DefaultFairyBehaviour")

    const actionsTimings = useMemo(() => [0, 2, 2, 3.2, 4.1, 5.5, 6.3, 7], []);

    const actions = useMemo(
        () => [
            () => {
                const transform = transformNodeRef.current;
                const target = globalActorRefs.player.position.scale(1.2).add(startPosition.scale(0.8)).scale(0.5);
                let easingFunction = new BezierCurveEase(0.03, 0.66, 0.72, 0.98);
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transform,
                        'position',
                        1,
                        2,
                        transform.position,
                        target,
                        0,
                        easingFunction
                    )
                );
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    smallTowardsPlayer
                )
            },
            () => {
                const transform = transformNodeRef.current;
                const target = transform.position.add(
                    transform.position.subtract(globalActorRefs.player.position).normalize().scale(20)
                );
                target.y = transform.position.y;
                const easingFunction = new BezierCurveEase(0.64, 0.24, 0.87, 0.41);
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transform,
                        'position',
                        1,
                        5,
                        transform.position,
                        target,
                        0,
                        easingFunction
                    )
                );
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumTowardsPlayer
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name = {name} position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
