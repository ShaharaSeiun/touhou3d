import { Constants, Vector2 } from '@babylonjs/core';
import nextPOT from 'next-power-of-two';
import { v4 } from 'uuid';
import { CustomCustomProceduralTexture } from '../../CustomCustomProceduralTexture';
import { makeTextureFromBlank, makeTextureFromVectors, parallelReducer } from '../BulletUtils';
import { ARENA_MAX, ARENA_MIN } from '../../../utils/Constants';
import { globalActorRefs } from '../../gameLogic/StaticRefs';

const makeComputeProceduralTexture = (
    shader,
    initialPositionTexture,
    initialVelocityTexture,
    initialCollisionTexture,
    initialValuesFunction,
    WIDTH,
    scene
) => {
    const proceduralTexture = new CustomCustomProceduralTexture(
        v4(),
        shader,
        WIDTH,
        scene,
        false,
        false,
        false,
        Constants.TEXTURETYPE_FLOAT
    );
    proceduralTexture.setTexture('velocitySampler', initialVelocityTexture);
    proceduralTexture.setTexture('positionSampler', initialPositionTexture);
    proceduralTexture.setTexture('collisionSampler', initialCollisionTexture);
    proceduralTexture.setVector3('playerPosition', globalActorRefs.player.position);
    proceduralTexture.setVector2('resolution', new Vector2(WIDTH, WIDTH));
    proceduralTexture.setFloat('delta', 0.001);

    if (initialValuesFunction) {
        initialValuesFunction(proceduralTexture);
    }

    return proceduralTexture;
};

export class DebugBehaviour {
    constructor() {

    }

    init(bulletMaterial, initialPositions, initialVelocities, scene) {
        this.scene = scene;

        this.initialPositionsTexture = makeTextureFromVectors(initialPositions, scene);
        this.initialVelocityTexture = makeTextureFromVectors(initialVelocities, scene, 1, 0);

        bulletMaterial.setTexture('positionSampler', this.initialPositionsTexture);
        bulletMaterial.setTexture('velocitySampler', this.initialVelocityTexture);

    }
    dispose() {
        this.initialPositionsTexture.dispose();
        this.initialVelocityTexture.dispose();

        this.ready = false;
    }
    update(deltaS) {
        return true;
    }
}

export const makeDebugBehaviour = (environmentCollision, radius, parent) => {
    return new DebugBehaviour(environmentCollision, radius, parent);
};

