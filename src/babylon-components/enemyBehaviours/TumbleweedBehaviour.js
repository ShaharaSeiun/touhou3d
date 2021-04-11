import { Animation, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../BabylonUtils';
import { AnimationContext } from '../gameLogic/GeneralContainer';
import { useDoSequence } from '../hooks/useDoSequence';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { useName } from '../hooks/useName';

const mediumRandomPlayer = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 0]
    },
    patternOptions: {
        pattern: 'single',
        position: [0, 0, 0],
        velocity: [[-1, 1], [-1, 1], -2, 8]
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

export const TumbleweedBehaviour = ({ children, leaveScene, spawn, target }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("tumbleweed")

    const actionsTimings = useMemo(() => [0, 2, 5], []);

    const actions = useMemo(
        () => [
            () => {
                const transform = transformNodeRef.current;
                const target = targetPosition;
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        transform,
                        'position',
                        1,
                        5,
                        transform.position,
                        target,
                        0
                    )
                );
                Animation.CreateAndStartAnimation(
                    name + "spinanim",
                    transform,
                    'rotation',
                    2,
                    1,
                    new Vector3(0, 0, 0),
                    new Vector3(0, 0, Math.PI * 2),
                    Animation.ANIMATIONLOOPMODE_CYCLE,
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    mediumRandomPlayer
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, actionsTimings, actions);

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
