import { randScalar } from '../../BabylonUtils';
import * as BulletVectorFunctions from './BulletVectorFunctions';

export const makeMultiBurstPattern = (patternOptions) => {
    let velocities = [];
    let positions = [];

    patternOptions.speeds.forEach(speedInst => {
        const speed = randScalar(speedInst);
        velocities.push(...BulletVectorFunctions.burst(patternOptions.num, speed, patternOptions.startTheta));

        const radius = patternOptions.radius || 0;
        positions.push(...BulletVectorFunctions.burst(patternOptions.num, radius, patternOptions.startTheta));
    })

    return {
        positions: positions,
        velocities: velocities,
    };
};
