import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { randVectorToPosition } from '../../../BabylonUtils';
import { makeReplaceInstruction } from '../../../bullets/BulletUtils';
import { useAddBulletGroup } from '../../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../../hooks/useDoSequence';
import { wriggleMidEnemyVectors } from './wriggleMidPhase1SpellCard';


export const traceArray = wriggleMidEnemyVectors.map(vector => {
    return {
        key: {
            current: vector
        },
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0, 1, 1]
        },
        patternOptions: {
            pattern: 'burst',
            num: difficulty => 7 * difficulty,
            speed: 0.01,
            radius: 0.3,
            repeat: {
                times: 30,
                delay: 0.1
            },
            uid: vector.toString()
        },
        endTimings: {
            timing: 'uniform',
            time: 3,
            uid: vector.toString()
        },
        meshOptions: {
            mesh: 'sphere',
            radius: 0.2
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
});

export const traceReplaceArray = traceArray.map(trace => makeReplaceInstruction(trace, {
    patternOptions: {
        type: 'rotateVelocitySine',
        forward: trace.key.current.scale(10),
        speed: 4,
        repeat: false
    },
    materialOptions: {
        color: [0, 0, 1]
    },
    meshOptions: {
        radius: 0.2
    },
    endTimings: {
        time: 3,
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
}))

export const WriggleMidMinionBehaviour = ({ children, leaveScene, spawn, forward }) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => spawn ? randVectorToPosition(spawn) : new Vector3(0, 0, 0), [spawn]);
    const actionsTimings = useMemo(() => [0, 9], []);
    const addBulletGroup = useAddBulletGroup();

    const actions = useMemo(
        () => [
            () => {
                const id = addBulletGroup(
                    transformNodeRef.current,
                    traceArray.find(trace => trace.key.current.equals(forward))
                )
                addBulletGroup(
                    transformNodeRef.current,
                    traceReplaceArray.find(trace => trace.key.current.equals(forward)),
                    id
                )
            },
            leaveScene
        ],
        [addBulletGroup, leaveScene, forward]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

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
