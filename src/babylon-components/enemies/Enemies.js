import { useCallback, useMemo, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { filterInPlace } from '../../utils/Utils';
import { useAddEffect } from '../hooks/useAddEffect';
import { Enemy } from './Enemy';
import { makeName } from '../hooks/useName';

let metaEnemies = {};
let listeningForEnemiesDead = false

export const Enemies = ({ currentActionList, setEpochIndex }) => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    const timeSinceStart = useMemo(() => ({ current: 0 }), [currentActionList]);

    const [enemies, setEnemies] = useState({});
    const addEffect = useAddEffect();

    const removeEnemyFromScene = useCallback((enemyName, deathLocation = false) => {
        metaEnemies = { ...metaEnemies };

        if (deathLocation) {
            const deathStartLocation = deathLocation.clone();
            addEffect(deathStartLocation, 'deathParticles');
        }

        delete metaEnemies[enemyName];
    }, [addEffect]);

    const doSpawnAction = useCallback((enemy) => {
        const enemyName = makeName(enemy.asset);
        metaEnemies = {
            ...metaEnemies,
            [enemyName]: enemy,
        };
    }, []);

    const executeAction = useCallback((action) => {
        switch (action.action) {
            case 'spawn':
                doSpawnAction(action.enemy);
                break;
            case 'nextEpoch':
                listeningForEnemiesDead = true;
                break;
            default:
                console.warn('Unsupported enemy-action action: ' + action.action);
        }
    }, [doSpawnAction]);

    useBeforeRender((scene) => {
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        timeSinceStart.current += deltaS;

        currentActionList.some((action) => {
            if (action.timeline < timeSinceStart.current) {
                executeAction(action);
                return false;
            }
            return true;
        });

        filterInPlace(currentActionList, (action) => action.timeline >= timeSinceStart.current);

        if (metaEnemies !== enemies) {
            setEnemies(metaEnemies);
        }

        if(listeningForEnemiesDead){
            if(Object.keys(enemies).length === 0){
                setEpochIndex(epochIndex => epochIndex + 1);
                listeningForEnemiesDead = false;
                console.log("epoch set")
            }
        }
    });

    return Object.keys(enemies).map((enemyName) => {
        const enemyObj = enemies[enemyName];
        return <Enemy 
            removeEnemyFromScene={removeEnemyFromScene} 
            key={enemyName} 
            name={enemyName} 
            {...enemyObj}
        />
    });
};
