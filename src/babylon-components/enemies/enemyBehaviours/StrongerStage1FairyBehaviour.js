import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useName } from '../../hooks/useName';
import { Stage1MinionDef } from "../../../stages/common/Stage1MinionDef"
import { Enemy } from "../../enemies/Enemy"
import { minionSpawn } from '../../../sounds/SFX';
import { useMinions } from '../../hooks/useMinions';

const multiBurst = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'multiBurst',
        speeds: [4, 8],
        num: 1000
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

const cone = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 0, 1]
    },
    patternOptions: {
        pattern: 'randomCone',
        speed: 8,
        num: 100,
        radialAngle: Math.PI,
        forwardVectors: [
            [0, 0, -1],
            [0.866, -0.25, 0.25],
            [-0.866, -0.25, 0.25],
            [0, 0.866, 0.25],
        ]
    },
    meshOptions: {
        mesh: 'sphere',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    soundOptions:{
        mute: true
    },
    lifespan: 10,
    wait: 0,
}

const stage1Minion = Stage1MinionDef();

export const StrongerStage1FairyBehaviour = ({ children, leaveScene, spawn, target }) => {
    const transformNodeRef = useRef();
    const minionRootTransformNodeRef = useRef();
    const {minions, setInScene} = useMinions(4);
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const minionStartPositions = useMemo(() => [
        new Vector3(0.1, 0, 0),
        new Vector3(-0.1, 0, 0),
        new Vector3(0, 0.1, 0),
        new Vector3(0, -0.1, 0)
    ], []);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("strongStage1Fairy");
    const actionsTimings = useMemo(() => [0, 2, 2, 2.5, 4, 7], []);

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
                minionSpawn.play()
                setInScene([0, 1, 2, 3], true)
                minions.forEach(minion => {
                    Animation.CreateAndStartAnimation(
                        'anim',
                        minion.ref.current,
                        'position',
                        1,
                        1,
                        minion.ref.current.position,
                        minion.ref.current.position.normalize().scale(1),
                        0,
                    )
                })
                
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    minionRootTransformNodeRef.current,
                    'rotation',
                    1,
                    4,
                    new Vector3(0, 0, 0),
                    new Vector3(0, 0, Math.PI * 2),
                    Animation.ANIMATIONLOOPMODE_CYCLE,
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    cone
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    const removeFromScene = useCallback((instName) => {
        if(instName.startsWith(name + 'minion')){
            const minionIndex = instName.replace(name + 'minion', '')
            setInScene(parseFloat(minionIndex), false)
        }
    }, [name, setInScene])

    return (
        <transformNode name={name} position={startPosition} ref={transformNodeRef}>
            <transformNode name={name} ref={minionRootTransformNodeRef}>
                {minions.map((minion, i) => (
                    <transformNode key={i} position={minionStartPositions[i]} 
                        name={name + 'minion' + i + 'Transform'}
                        ref={minion.ref}>
                        {minion.inScene && (
                            <Enemy 
                                removeEnemyFromScene={removeFromScene} 
                                name={name + 'minion' + i} 
                                {...stage1Minion} 
                            />
                        )}
                    </transformNode>
                ))}
            </transformNode>
            {children}
        </transformNode>
    );
};
