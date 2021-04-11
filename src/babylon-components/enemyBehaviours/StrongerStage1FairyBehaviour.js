import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { randVectorToPosition } from '../BabylonUtils';
import { AnimationContext } from '../gameLogic/GeneralContainer';
import { useDoSequence } from '../hooks/useDoSequence';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { useName } from '../hooks/useName';
import { Stage1MinionDef } from "../../stages/common/Stage1MinionDef"
import { Enemy } from "../enemyLogic/Enemy"
import { minionSpawn } from '../../sounds/SFX';

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
        radius: 0.1
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
        radius: 0.1
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
    const minion1TransformNodeRef = useRef();
    const minion2TransformNodeRef = useRef();
    const minion3TransformNodeRef = useRef();
    const minion4TransformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn]);
    const targetPosition = useMemo(() => randVectorToPosition(target), [target]);
    const minion1Position = useMemo(() => new Vector3(0.1, 0, 0), []);
    const minion2Position = useMemo(() => new Vector3(-0.1, 0, 0), []);
    const minion3Position = useMemo(() => new Vector3(0, 0.1, 0), []);
    const minion4Position = useMemo(() => new Vector3(0, -0.1, 0), []);
    const { registerAnimation } = useContext(AnimationContext);
    const addBulletGroup = useAddBulletGroup();
    const name = useName("strongStage1Fairy");
    const [minion1InScene, setMinion1InScene] = useState(false);
    const [minion2InScene, setMinion2InScene] = useState(false);
    const [minion3InScene, setMinion3InScene] = useState(false);
    const [minion4InScene, setMinion4InScene] = useState(false);

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
                setMinion1InScene(true);
                setMinion2InScene(true);
                setMinion3InScene(true);
                setMinion4InScene(true)
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
                    'anim',
                    minion3TransformNodeRef.current,
                    'position',
                    1,
                    1,
                    new Vector3(0, 0.1, 0),
                    minion3TransformNodeRef.current.position.normalize(),
                    0,
                )
                Animation.CreateAndStartAnimation(
                    'anim',
                    minion4TransformNodeRef.current,
                    'position',
                    1,
                    1,
                    new Vector3(0, -0.1, 0),
                    minion4TransformNodeRef.current.position.normalize(),
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
                    cone
                )
            },
            leaveScene,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [leaveScene]
    );

    useDoSequence(true, actionsTimings, actions);

    const removeFromScene = useCallback((instName) => {
        if(instName === name + 'minion1'){
            setMinion1InScene(false);
        }
        if(instName === name + 'minion2'){
            setMinion2InScene(false);
        }
        if(instName === name + 'minion3'){
            setMinion3InScene(false);
        }
        if(instName === name + 'minion4'){
            setMinion4InScene(false);
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
                            {...stage1Minion} 
                        />
                    )}
                </transformNode>
                <transformNode position={minion2Position} name={name + 'minion2Transform'} ref={minion2TransformNodeRef}>
                    {minion2InScene && (
                        <Enemy 
                            removeEnemyFromScene={removeFromScene} 
                            name={name + 'minion2'} 
                            {...stage1Minion} 
                        />
                    )}
                </transformNode>
                <transformNode position={minion3Position} name={name + 'minion3Transform'} ref={minion3TransformNodeRef}>
                    {minion3InScene && (
                        <Enemy 
                            removeEnemyFromScene={removeFromScene} 
                            name={name + 'minion3'} 
                            {...stage1Minion} 
                        />
                    )}
                </transformNode>
                <transformNode position={minion4Position} name={name + 'minion4Transform'} ref={minion4TransformNodeRef}>
                    {minion4InScene && (
                        <Enemy 
                            removeEnemyFromScene={removeFromScene} 
                            name={name + 'minion4'} 
                            {...stage1Minion} 
                        />
                    )}
                </transformNode>
            </transformNode>
            {children}
        </transformNode>
    );
};
