import { globalActorRefs } from "../../gameLogic/StaticRefs";
import { BulletBehaviour } from "./BulletBehaviour";

export class PlayerBulletBehaviour extends BulletBehaviour{
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction, needsEnemies){

        const playerInitialValuesFunction = needsEnemies ? (texture) => {
            if(initialValuesFunction) initialValuesFunction(texture);
            texture.setFloats("enemyPositions", globalActorRefs.enemiesBuffer);
            texture.setFloats("enemyRadii", globalActorRefs.enemyRadiiBuffer);
        } : initialValuesFunction;

        super(positionShader, velocityShader, parent, collideWithEnvironment, playerInitialValuesFunction);
        this.collisionShader = "playerBulletCollision";
        this.isEnemyBullet = false;
        this.isPlayerBullet = true;
        this.needsEnemies = needsEnemies;
    }

    bindCollisionVars = (texture) => {
        super.bindCollisionVars(texture);
        texture.setFloats("enemyPositions", globalActorRefs.enemiesBuffer);
        texture.setFloats("enemyRadii", globalActorRefs.enemyRadiiBuffer);
    }

    update(deltaS){
        const ready = super.update(deltaS);

        if(ready){
            this.collisionTexture1.setFloats("enemyPositions", globalActorRefs.enemiesBuffer);
            this.collisionTexture2.setFloats("enemyPositions", globalActorRefs.enemiesBuffer);
            this.collisionTexture1.setFloats("enemyRadii", globalActorRefs.enemyRadiiBuffer);
            this.collisionTexture2.setFloats("enemyRadii", globalActorRefs.enemyRadiiBuffer);

            if(this.needsEnemies){
                ready.forEach(texture => {
                    texture.setFloats("enemyPositions", globalActorRefs.enemiesBuffer);
                    texture.setFloats("enemyRadii", globalActorRefs.enemyRadiiBuffer);
                })
            }
        }
        return ready;
    }
}