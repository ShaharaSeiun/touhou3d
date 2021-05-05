import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { v4 } from 'uuid';
import { addEnemy, globalActorRefs, removeEnemy } from '../gameLogic/StaticRefs';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { makeEnemyMesh } from './enemyActors';
import { Targeting } from './enemyActors/Targeting';
import { makeEnemyBehaviour } from './enemyBehaviours';
import { makeEnemyMovement } from './enemyMovements';


export const Enemy = ({ name, radius, health, deathInstruction, removeEnemyFromScene, meshProps, behaviourProps, movementProps }) => {
    const enemyRef = useRef();
    const [enemy, setEnemy] = useState();
    const [enemyRender, setEnemyRender] = useState(false)
    const [positionID, setPositionID] = useState();
    const addBulletGroup = useAddBulletGroup();

    const leaveScene = useCallback(() => {
        if (positionID === undefined || positionID === null || globalActorRefs.enemies[positionID].dead) return;
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
                if (deathInstruction) addBulletGroup({
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

    useEffect(() => {
        return () => {
            leaveScene();
        }
    }, [leaveScene])

    useBeforeRender(() => {
        if (enemyRef.current && !enemy) {
            setEnemy(enemyRef.current);
        }
        if (!enemy || !positionID || globalActorRefs.enemies[positionID].dead) return;

        const enemyWorldPosition = enemy.getAbsolutePosition();

        globalActorRefs.enemies[positionID].position = enemyWorldPosition;
    });

    useEffect(() => {


        const BehaviourClass = makeEnemyBehaviour(behaviourProps.type);
        const EnemyMeshClass = makeEnemyMesh(meshProps.type);
        const MovementClass = makeEnemyMovement(movementProps.type)

        setEnemyRender(<MovementClass name={v4()} {...movementProps}>
            <BehaviourClass leaveScene={leaveScene} {...behaviourProps}>
                <Targeting radius={radius} />
                <EnemyMeshClass radius={radius} {...meshProps} ref={enemyRef} />
            </BehaviourClass>
        </MovementClass>)
    }, [meshProps, behaviourProps, movementProps, leaveScene, radius])

    return enemyRender;
};
