import { Vector3 } from '@babylonjs/core';
import { RandVector3 } from '../../BabylonUtils';

export const makeArcPattern = (patternOptions, parent) => {

    const from = new RandVector3(...patternOptions.from);
    const to = new RandVector3(...patternOptions.to);
    const positions = [];
    const velocities = [];

    for(let i = 0; i < patternOptions.num; i++) {
        const perc = i/(patternOptions.num - 1);

        const newForward = Vector3.Lerp(from, to, perc)
        newForward.normalize();
        velocities.push(newForward.scale(patternOptions.speed || 1))
        positions.push(newForward.scale(patternOptions.radius || 1))
    }

    return {
        positions,
        velocities,
    };
};
