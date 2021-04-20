import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { randVectorToPosition } from '../../BabylonUtils';
import { AnimationContext } from '../../gameLogic/GeneralContainer';
import { useDoSequence } from '../../hooks/useDoSequence';
import { useAddBulletGroup } from '../../hooks/useAddBulletGroup';
import { useName } from '../../hooks/useName';
import { InertOrbitMinionDef } from '../../../stages/common/InertOrbitMinionDef'
import { Enemy } from '../../enemies/Enemy'
import { minionSpawn } from '../../../sounds/SFX';

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
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'linear',
    },
    lifespan: 10,
    wait: 0,
}

const area = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 0, 0]
    },
    patternOptions: {
        pattern: 'area',
        speed: 4,
        num: 5,
        radialAngle: Math.PI/4,
        towardsPlayer: true
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

const inertMinion1 = InertOrbitMinionDef();
const inertMinion2 = InertOrbitMinionDef();

export const StrongStage1FairyBehaviour = ({ children, leaveScene, spawn, target }) => {
    const transformNodeRef = useRef();
    const minionRootTransformNodeRef = useRef();
    const minion1TransformNodeRef = useRef();
    const minion2TransformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const minion1Position = useMemo(() => new Vector3(0.1, 0, 0), []);
    const minion2Position = useMemo(() => new Vector3(-0.1, 0, 0), []);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("strongStage1Fairy");
    const [minion1InScene, setMinion1InScene] = useState(false);
    const [minion2InScene, setMinion2InScene] = useState(false);

    const actionsTimings = useMemo(() => [0, 2, 2, 2.5, 3, 4, 5, 6, 7], []);

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
                setMinion1InScene(true);
                setMinion2InScene(true);
                Animation.CreateAndStartAnimation(
                    'anim',
                    minion1TransformNodeRef.current,
                    'position',
                    1,
                    1,
                    new Vector3(0.1, 0, 0),
                    minion1TransformNodeRef.current.position.normalize(),
                    0,
                )
                Animation.CreateAndStartAnimation(
                    'anim',
                    minion2TransformNodeRef.current,
                    'position',
                    1,
                    1,
                    new Vector3(-0.1, 0, 0),
                    minion2TransformNodeRef.current.position.normalize(),
                    0,
                )
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
                    area
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
                )
            },
            () => {
                addBulletGroup(
                    transformNodeRef.current,
                    area
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, transformNodeRef, actionsTimings, actions);

    const removeFromScene = useCallback((instName) => {
        if(instName === name + 'minion1'){
            setMinion1InScene(false);
        }
        if(instName === name + 'minion2'){
            setMinion2InScene(false);
        }
    }, [name])

    return (
        <transformNode name={name} position={startPosition} ref={transformNodeRef}>
            <transformNode name={name} ref={minionRootTransformNodeRef}>
                <transformNode position={minion1Position} name={name + 'minion1Transform'} ref={minion1TransformNodeRef}>
                    {minion1InScene && (
                        <Enemy 
                            removeEnemyFromScene={removeFromScene} 
                            name={name + 'minion1'} 
                            {...inertMinion1} 
                        />
                    )}
                </transformNode>
                <transformNode position={minion2Position} name={name + 'minion2Transform'} ref={minion2TransformNodeRef}>
                    {minion2InScene && (
                        <Enemy 
                            removeEnemyFromScene={removeFromScene} 
                            name={name + 'minion2'} 
                            {...inertMinion2} 
                        />
                    )}
                </transformNode>
            </transformNode>
            {children}
        </transformNode>
    );
};
