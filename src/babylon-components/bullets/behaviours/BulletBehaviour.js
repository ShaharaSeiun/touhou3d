import { Constants, Texture, Vector2, Vector3 } from '@babylonjs/core';
import nextPOT from 'next-power-of-two';
import { v4 } from 'uuid';
import { CustomCustomProceduralTexture } from '../../CustomCustomProceduralTexture';
import { makeTextureFromArray, makeTextureFromBlank, makeTextureFromVectors, makeTextureFromVectorsAndArray, parallelReducer } from '../BulletUtils';
import { ARENA_MAX, ARENA_MIN } from '../../../utils/Constants';
import { globalActorRefs } from '../../gameLogic/StaticRefs';

const makeComputeProceduralTexture = (
    parent,
    shader,
    zeroPositionsTexture,
    initialPositionTexture,
    initialVelocityTexture,
    initialCollisionTexture,
    timingsTexture,
    endTimingsTexture,
    initialValuesFunction,
    reliesOnParent,
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
    proceduralTexture.setTexture('positionSampler', zeroPositionsTexture);
    proceduralTexture.setTexture('initialPositionSampler', initialPositionTexture);
    proceduralTexture.setTexture('collisionSampler', initialCollisionTexture);
    proceduralTexture.setTexture('timingsSampler', timingsTexture);
    proceduralTexture.setTexture('endTimingsSampler', endTimingsTexture);
    proceduralTexture.setVector3('playerPosition', globalActorRefs.player.position);
    proceduralTexture.setVector3('parentPosition', parent.getAbsolutePosition());
    proceduralTexture.setFloat('reliesOnParent', reliesOnParent);
    proceduralTexture.setVector2('resolution', new Vector2(WIDTH, WIDTH));
    proceduralTexture.setFloat('delta', 0.001);
    proceduralTexture.setFloat('timeSinceStart', 0.001)
    proceduralTexture.setFloat('spawning', 0.)

    if (initialValuesFunction) {
        initialValuesFunction(proceduralTexture);
    }

    return proceduralTexture;
};

export class BulletBehaviour {
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction = null, radius = 1) {
        if (!collideWithEnvironment.x) {
            throw new Error('collideWithEnvironment must be a vector');
        }

        this.parent = parent;
        this.positionShader = positionShader;
        this.velocityShader = velocityShader;
        this.collideWithEnvironment = collideWithEnvironment;
        this.radius = radius;
        this.spawning = 1.;

        this.initialValuesFunction = initialValuesFunction;
    }

    bindCollisionVars(texture) {
        texture.setVector3('arenaMin', ARENA_MIN);
        texture.setVector3('arenaMax', ARENA_MAX);
        texture.setVector3('collideWithEnvironment', this.collideWithEnvironment);
    }

    init(bulletMaterial, initialPositions, initialVelocities, timings, endTimings, reliesOnParent, disableWarning, scene) {
        const num = timings.length;
        const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num))), 2);

        this.scene = scene;

        this.zeroPositionsTexture = makeTextureFromBlank(timings.length, scene, 1., -510., -510.);
        this.initialPositionsTexture = (initialPositions instanceof Texture) ? initialPositions : 
            makeTextureFromVectors(initialPositions, scene, 1, -510);
        this.initialVelocityTexture = makeTextureFromVectors(initialVelocities, scene, 1, 0);
        this.initialCollisionTexture = makeTextureFromBlank(timings.length, scene, 0, 0);
        const timingsTexture = makeTextureFromArray(timings, scene);
        const endTimingsTexture = makeTextureFromArray(endTimings, scene);
        

        this.positionTexture1 = makeComputeProceduralTexture(
            this.parent,
            this.positionShader,
            this.zeroPositionsTexture,
            this.initialPositionsTexture,
            this.initialVelocityTexture,
            this.initialCollisionTexture,
            timingsTexture,
            endTimingsTexture,
            this.initialValuesFunction,
            reliesOnParent,
            WIDTH,
            scene
        );
        this.velocityTexture1 = makeComputeProceduralTexture(
            this.parent,
            this.velocityShader,
            this.zeroPositionsTexture,
            this.initialPositionsTexture,
            this.initialVelocityTexture,
            this.initialCollisionTexture,
            timingsTexture,
            endTimingsTexture,
            this.initialValuesFunction,
            reliesOnParent,
            WIDTH,
            scene
        );
        this.collisionTexture1 = makeComputeProceduralTexture(
            this.parent,
            this.collisionShader,
            this.zeroPositionsTexture,
            this.initialPositionsTexture,
            this.initialVelocityTexture,
            this.initialCollisionTexture,
            timingsTexture,
            endTimingsTexture,
            this.bindCollisionVars,
            reliesOnParent,
            WIDTH,
            scene
        );
        this.positionTexture2 = makeComputeProceduralTexture(
            this.parent,
            this.positionShader,
            this.zeroPositionsTexture,
            this.initialPositionsTexture,
            this.initialVelocityTexture,
            this.initialCollisionTexture,
            timingsTexture,
            endTimingsTexture,
            this.initialValuesFunction,
            reliesOnParent,
            WIDTH,
            scene
        );
        this.velocityTexture2 = makeComputeProceduralTexture(
            this.parent,
            this.velocityShader,
            this.zeroPositionsTexture,
            this.initialPositionsTexture,
            this.initialVelocityTexture,
            this.initialCollisionTexture,
            timingsTexture,
            endTimingsTexture,
            this.initialValuesFunction,
            reliesOnParent,
            WIDTH,
            scene
        );
        this.collisionTexture2 = makeComputeProceduralTexture(
            this.parent,
            this.collisionShader,
            this.zeroPositionsTexture,
            this.initialPositionsTexture,
            this.initialVelocityTexture,
            this.initialCollisionTexture,
            timingsTexture,
            endTimingsTexture,
            this.bindCollisionVars,
            reliesOnParent,
            WIDTH,
            scene
        );

        if (this.isEnemyBullet) {
            const [collisionResult, reducerLayers] = parallelReducer(this.collisionTexture1, WIDTH, scene);
            this.collisionResult = collisionResult;
            this.reducerLayers = reducerLayers;
        } else {
            this.collisionResult = this.collisionTexture1;
        }

        bulletMaterial.setTexture('positionSampler', this.initialPositionsTexture);
        bulletMaterial.setTexture('velocitySampler', this.initialVelocityTexture);
        bulletMaterial.setTexture('collisionSampler', this.initialVelocityTexture);
        bulletMaterial.setTexture('timingsSampler', timingsTexture);
        bulletMaterial.setTexture('endTimingsSampler', endTimingsTexture);
        bulletMaterial.setFloat('timeSinceStart', 0.001);
        bulletMaterial.setFloat('disableWarning', disableWarning ? 1 : 0)

        this.justStarted = true;
        this.frame = 0;
        this.bulletMaterial = bulletMaterial;
        this.ready = true;
        this.timeSinceStart = 0.001;
    }
    dispose() {
        this.positionTexture1.dispose();
        this.velocityTexture1.dispose();
        this.collisionTexture1.dispose();
        this.positionTexture2.dispose();
        this.velocityTexture2.dispose();
        this.collisionTexture2.dispose();
        this.initialPositionsTexture.dispose();
        this.initialVelocityTexture.dispose();
        this.initialCollisionTexture.dispose();

        if (this.isEnemyBullet) {
            this.collisionResult.dispose();
            this.reducerLayers.forEach((reducer) => {
                reducer.dispose();
            });
        }

        this.ready = false;
    }
    update(deltaS) {
        if (!this.ready) {
            return false;
        }

        if(this.parent.getAbsolutePosition().equals(Vector3.Zero())){
            this.spawning = 0.;
        }

        if (
            !this.positionTexture2.isReady() ||
            !this.velocityTexture2.isReady() ||
            !this.collisionTexture2.isReady() ||
            !this.positionTexture1.isReady() ||
            !this.velocityTexture1.isReady() ||
            !this.collisionTexture1.isReady()
        ) {
            return false;
        }

        if (this.justStarted) {
            this.justStarted = false;
            this.positionTexture2.isReady = () => true;
            this.velocityTexture2.isReady = () => true;
            this.collisionTexture2.isReady = () => true;
            this.positionTexture1.isReady = () => true;
            this.velocityTexture1.isReady = () => true;
            this.collisionTexture1.isReady = () => true;
        }

        let inputPositionTexture;
        let outputPositionTexture;
        let inputVelocityTexture;
        let outputVelocityTexture;
        let inputCollisionTexture;
        let outputCollisionTexture;

        if (this.frame === 0) {
            inputVelocityTexture = this.velocityTexture1;
            inputPositionTexture = this.positionTexture1;
            inputCollisionTexture = this.collisionTexture1;
            outputVelocityTexture = this.velocityTexture2;
            outputPositionTexture = this.positionTexture2;
            outputCollisionTexture = this.collisionTexture2;
            this.frame = 1;
        } else {
            inputVelocityTexture = this.velocityTexture2;
            inputPositionTexture = this.positionTexture2;
            inputCollisionTexture = this.collisionTexture2;
            outputVelocityTexture = this.velocityTexture1;
            outputPositionTexture = this.positionTexture1;
            outputCollisionTexture = this.collisionTexture1;
            this.frame = 0;
        }

        inputVelocityTexture.sleep = false;
        inputPositionTexture.sleep = false;
        inputCollisionTexture.sleep = false;
        outputVelocityTexture.sleep = true;
        outputPositionTexture.sleep = true;
        outputCollisionTexture.sleep = true;

        this.timeSinceStart += deltaS

        outputPositionTexture.setTexture('positionSampler', inputPositionTexture);
        outputPositionTexture.setTexture('velocitySampler', inputVelocityTexture);
        outputPositionTexture.setTexture('collisionSampler', inputCollisionTexture);
        outputPositionTexture.setVector3('parentPosition', this.parent.getAbsolutePosition());
        outputPositionTexture.setFloat('delta', deltaS);
        outputPositionTexture.setFloat('spawning', this.spawning)
        outputPositionTexture.setFloat('timeSinceStart', this.timeSinceStart);
        outputPositionTexture.setVector3('playerPosition', globalActorRefs.player.position);
        outputVelocityTexture.setTexture('positionSampler', inputPositionTexture);
        outputVelocityTexture.setTexture('velocitySampler', inputVelocityTexture);
        outputVelocityTexture.setTexture('collisionSampler', inputCollisionTexture);
        outputVelocityTexture.setVector3('parentPosition', this.parent.getAbsolutePosition());
        outputVelocityTexture.setFloat('delta', deltaS);
        outputVelocityTexture.setFloat('spawning', this.spawning)
        outputVelocityTexture.setFloat('timeSinceStart', this.timeSinceStart);
        outputVelocityTexture.setVector3('playerPosition', globalActorRefs.player.position);

        outputCollisionTexture.setTexture('positionSampler', inputPositionTexture);
        outputCollisionTexture.setTexture('velocitySampler', inputVelocityTexture);
        outputCollisionTexture.setFloat('timeSinceStart', this.timeSinceStart);

        if (this.isEnemyBullet) {
            this.reducerLayers[0].setTexture('source', outputCollisionTexture);
        } else {
            this.collisionResult = outputCollisionTexture;
        }

        this.bulletMaterial.setTexture('collisionSampler', inputCollisionTexture);
        this.bulletMaterial.setTexture('positionSampler', inputPositionTexture);
        this.bulletMaterial.setTexture('velocitySampler', inputVelocityTexture);
        this.bulletMaterial.setFloat('timeSinceStart', this.timeSinceStart);

        return [outputPositionTexture, outputVelocityTexture];
    }
}
