import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../BabylonUtils';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { useDoSequence } from '../hooks/useDoSequence';

const small = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'single',
        speed: 8,
        position: [0, 0, 0],
        velocity: [0, 0, -8],
        repeat: {
            times: 32,
            delay: 0.1
        }
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.1
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    soundOptions: {
        mute: true
    },
    lifespan: 10,
    wait: 0,
}

export const Stage1MinionBehaviour = ({ children, leaveScene, spawn}) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => spawn ? randVectorToPosition(spawn) : new Vector3(0, 0, 0), [spawn]);
    const actionsTimings = useMemo(() => [2], []);
    const addBulletGroup = useAddBulletGroup();

    const actions = useMemo(
        () => [
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    small
                )
            }
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(true, actionsTimings, actions);

    useEffect(() => {
        return () => {
            leaveScene();
        }
    }, [leaveScene])

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    );
};