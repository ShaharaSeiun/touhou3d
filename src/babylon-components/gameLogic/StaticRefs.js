import { Matrix, Vector3 } from '@babylonjs/core';
import { times } from 'lodash';
import { MAX_BULLETS_PER_GROUP, MAX_ENEMIES } from '../../utils/Constants';

export const allBullets = {};

export const enemyDefaultVals = {
    position: new Vector3(-1000000, -1000000, -1000000),
    health: -1000000,
    radius: 0,
    onDeath: () => {},
};

export const globalActorRefs = {
    enemies: times(MAX_ENEMIES, () => enemyDefaultVals),
    player: {
        position: new Vector3(0, 0, 0),
    },
    enemiesBuffer: new Float32Array(times(MAX_ENEMIES * 3, () => -1000000)),
    enemyRadiiBuffer: new Float32Array(times(MAX_ENEMIES, () => 0)),
    enemyIndex: 0,
};

export const bufferMatricesSource = new Float32Array(MAX_BULLETS_PER_GROUP * 16);
for (let i = 0; i < MAX_BULLETS_PER_GROUP; i++) {
    const matrix = Matrix.Identity();
    matrix.copyToArray(bufferMatricesSource, i * 16);
}
