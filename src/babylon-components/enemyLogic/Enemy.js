import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { addEnemy, globalActorRefs, removeEnemy } from '../gameLogic/StaticRefs';
import { FairyBase } from '../enemyActors/FairyBase';
import { useAssets } from '../hooks/useAssets';
import { RandomEnemyBehaviour } from '../enemyBehaviours/RandomEnemyBehaviour';
import { DefaultFairyBehaviour } from '../enemyBehaviours/DefaultFairyBehaviour';
import { StrongStage1FairyBehaviour } from '../enemyBehaviours/StrongStage1FairyBehaviour';
import { FairyBaseWithMagicCircle } from '../enemyActors/FairyBaseWithMagicCircle';


export const Enemy = ({ type, name, asset, behaviour, radius, health, deathInstruction, removeEnemyFromScene, spawn, target }) => {
    const enemyRef = useRef();
    const [enemy, setEnemy] = useState();
    const mesh = useAssets(asset);
    const [positionID, setPositionID] = useState();
    const addBulletGroup = useAddBulletGroup();

    const leaveScene = useCallback(() => {
        removeEnemy(positionID);
        removeEnemyFromScene(name);
    }, [removeEnemyFromScene, name, positionID]);

    useEffect(() => {
        if (!enemy) return; //on death
        const id = addEnemy(
            enemy.getAbsolutePosition(),
            radius,
            () => {
                const deathPosition = enemy.getAbsolutePosition()
                addBulletGroup({
                    getAbsolutePosition: () => {
                        return deathPosition;
                    }
                }, deathInstruction);
                removeEnemyFromScene(name, deathPosition);
            },
            health
        );
        setPositionID(id);
    }, [enemy, radius, name, removeEnemyFromScene, health, deathInstruction, addBulletGroup]);

    useBeforeRender(() => {
        if (enemyRef.current && !enemy) {
            setEnemy(enemyRef.current);
        }
        if (!enemy || !positionID || globalActorRefs.enemies[positionID].dead) return;

        const enemyWorldPosition = enemy.getAbsolutePosition();

        globalActorRefs.enemies[positionID].position = enemyWorldPosition;
    });

    let enemyMesh;

    switch (type) {
        case 'fairy':
            enemyMesh = <FairyBase mesh={mesh} radius={radius} assetName={asset} ref={enemyRef} />;
            break;
        case 'fairyWithMagicCircle':
            enemyMesh = <FairyBaseWithMagicCircle mesh={mesh} radius={radius} assetName={asset} ref={enemyRef} />;
            break;
        default:
            throw new Error('Unknown Enemy type: ' + type);
    }

    let BehaviourClass;

    switch (behaviour) {
        case 'random':
            BehaviourClass = RandomEnemyBehaviour;
            break;
        case 'defaultFairy':
            BehaviourClass = DefaultFairyBehaviour;
            break;
        case 'strongStage1Fairy':
            BehaviourClass = StrongStage1FairyBehaviour;
            break;
        default:
            throw new Error('Unknown Behaviour type: ' + behaviour);
    }

    return (
        <BehaviourClass leaveScene={leaveScene} spawn={spawn} target={target}>
            {enemyMesh}
        </BehaviourClass>
    );
};
