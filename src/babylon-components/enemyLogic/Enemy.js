import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { addEnemy, globalActorRefs, removeEnemy } from '../gameLogic/StaticRefs';
import { FairyBase } from '../enemyActors/FairyBase';
import { TempActor } from '../enemyActors/TempActor';
import { RandomEnemyBehaviour } from '../enemyBehaviours/RandomEnemyBehaviour';
import { DefaultFairyBehaviour } from '../enemyBehaviours/DefaultFairyBehaviour';
import { StrongStage1FairyBehaviour } from '../enemyBehaviours/StrongStage1FairyBehaviour';
import { FairyBaseWithMagicCircle } from '../enemyActors/FairyBaseWithMagicCircle';
import { MinionBase } from '../enemyActors/MinionBase';
import { Wriggle } from '../enemyActors/Wriggle';
import { InertMinionBehaviour } from '../enemyBehaviours/InertMinionBehaviour';
import { StrongerStage1FairyBehaviour } from '../enemyBehaviours/StrongerStage1FairyBehaviour';
import { Stage1MinionBehaviour } from '../enemyBehaviours/Stage1MinionBehaviour';
import { TumbleweedBehaviour } from '../enemyBehaviours/TumbleweedBehaviour';
import { BOSS_WriggleBehaviour1 } from '../enemyBehaviours/BOSS_WriggleBehaviour1';
import { BOSS_WriggleBehaviour2 } from '../enemyBehaviours/BOSS_WriggleBehaviour2';


export const Enemy = ({ name, radius, health, deathInstruction, removeEnemyFromScene, meshProps, behaviourProps }) => {
    const enemyRef = useRef();
    const [enemy, setEnemy] = useState();
    const [enemyRender, setEnemyRender] = useState(false)
    const [positionID, setPositionID] = useState();
    const addBulletGroup = useAddBulletGroup();

    const leaveScene = useCallback(() => {
        if(positionID === undefined || positionID === null) return;
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
                if(deathInstruction) addBulletGroup({
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

    useEffect(() => {
        let EnemyMeshClass
        switch (meshProps.type) {
            case 'fairy':
                EnemyMeshClass = FairyBase;
                break;
            case 'fairyWithMagicCircle':
                EnemyMeshClass = FairyBaseWithMagicCircle;
                break;
            case 'minion':
                EnemyMeshClass = MinionBase;
                break;
            case 'tempActor':
                EnemyMeshClass = TempActor;
                break;
            case 'wriggle':
                EnemyMeshClass = Wriggle;
                break;
            default:
                throw new Error('Unknown Enemy type: ' + meshProps.type);
        }
    
        let BehaviourClass;
        switch (behaviourProps.type) {
            case 'random':
                BehaviourClass = RandomEnemyBehaviour;
                break;
            case 'inertMinion':
                BehaviourClass = InertMinionBehaviour;
                break;
            case 'tumbleweed':
                BehaviourClass = TumbleweedBehaviour;
                break;
            case 'stage1Minion':
                BehaviourClass = Stage1MinionBehaviour;
                break;
            case 'defaultFairy':
                BehaviourClass = DefaultFairyBehaviour;
                break;
            case 'strongStage1Fairy':
                BehaviourClass = StrongStage1FairyBehaviour;
                break;
            case 'strongerStage1Fairy':
                BehaviourClass = StrongerStage1FairyBehaviour;
                break;
            case 'wriggle1':
                BehaviourClass =  BOSS_WriggleBehaviour1;
                break;  
            case 'wriggle2':
                BehaviourClass =  BOSS_WriggleBehaviour2;
                break;  
            default:
                throw new Error('Unknown Behaviour type: ' + behaviourProps.type);
        }

        setEnemyRender(<BehaviourClass leaveScene={leaveScene} {...behaviourProps}>
            <EnemyMeshClass radius={radius} {...meshProps} ref={enemyRef}/>
        </BehaviourClass>)
    }, [meshProps, behaviourProps, leaveScene, radius])

    return enemyRender;
};
