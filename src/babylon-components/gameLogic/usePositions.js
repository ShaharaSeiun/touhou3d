import { useCallback } from "react";
import { useBeforeRender } from "react-babylonjs";
import { MAX_ENEMIES } from "../../utils/Constants";
import { enemyDefaultVals, globalActorRefs } from "./StaticRefs";

export const usePositions = () => {
    const addEnemy = useCallback((position, radius, onDeath, health) => {
        const indexToAdd = globalActorRefs.enemyIndex
        globalActorRefs.enemies[indexToAdd] = {
            position,
            health,
            radius,
            onDeath
        }
        globalActorRefs.enemyIndex = (globalActorRefs.enemyIndex + 1) % MAX_ENEMIES;
        return indexToAdd;
    }, [])

    const removeEnemy = useCallback((id) => {
        globalActorRefs.enemies[id] = enemyDefaultVals
    }, [])

    const killEnemy = useCallback((id) => {
        if(!globalActorRefs.enemies[id].dead){
            globalActorRefs.enemies[id].onDeath();
            globalActorRefs.enemies[id].dead = true;
            removeEnemy(id);
        }
    }, [removeEnemy])

    useBeforeRender(() => {
        globalActorRefs.enemies.forEach((enemy, i) => {
            globalActorRefs.enemiesBuffer[i * 3 + 0] = enemy.position.x
            globalActorRefs.enemiesBuffer[i * 3 + 1] = enemy.position.y
            globalActorRefs.enemiesBuffer[i * 3 + 2] = enemy.position.z
            globalActorRefs.enemyRadiiBuffer[i] = enemy.radius;
        })
    })

    return {addEnemy, removeEnemy, killEnemy}
}