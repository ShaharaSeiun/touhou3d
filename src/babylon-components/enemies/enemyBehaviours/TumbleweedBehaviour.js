import { Animation, Vector3 } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useName } from '../../hooks/useName';

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

export const TumbleweedBehaviour = ({ children, leaveScene }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => new Vector3(0, 0, 0), []);
    const addBulletGroup = useAddBulletGroup();

    const actionsTimings = useMemo(() => [2, 5], []);

    const actions = useMemo(
        () => [
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

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};
