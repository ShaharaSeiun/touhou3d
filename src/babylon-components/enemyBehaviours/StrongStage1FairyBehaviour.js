import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../BabylonUtils';
import { AnimationContext } from '../gameLogic/GeneralContainer';
import { useDoSequence } from '../hooks/useDoSequence';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';

const multiBurst = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 0, 0]
    },
    patternOptions: {
        pattern: 'multiBurst',
        speeds: [4, 8],
        num: 1000
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10000,
    wait: 0,
}

export const StrongStage1FairyBehaviour = ({ children, leaveScene, spawn, target }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();

    const actionsTimings = useMemo(() => [0, 2, 2, 2.5, 7], []);

    const actions = useMemo(
        () => [
            () => {
                const transform = transformNodeRef.current;
                const target = startPosition.add(new Vector3(0, 0, -4));
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
                    multiBurst
                )
            },
            () => {
                const transform = transformNodeRef.current;
                const target = targetPosition
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
                    )
                );
            },
            () => {

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
