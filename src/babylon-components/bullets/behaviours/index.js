import { makeItembehaviour } from './ItemBehaviour';
import { makeLinearBehaviour } from './LinearBehaviour';
import { makePlayerShotBehaviour } from './PlayerShotBehaviour';
import { makePlayerShotTrackingBehaviour } from './PlayerShotTrackingBehaviour';
import { makePlayerShotAccelerationBehaviour } from './PlayerShotAccelerationBehaviour';
import { makeSlowToStopBehaviour } from './SlowToStop';

export const makeBulletBehaviour = (behaviourOptions, environmentCollision, radius, parent) => {
    switch (behaviourOptions.behaviour) {
        case 'linear':
            return makeLinearBehaviour(environmentCollision, radius, parent);
        case 'slowToStop':
            return makeSlowToStopBehaviour(environmentCollision, radius, parent);
        case 'item':
            return makeItembehaviour(behaviourOptions, environmentCollision, radius, parent);
        case 'playerShot':
            return makePlayerShotBehaviour(behaviourOptions, environmentCollision, parent);
        case 'playerShotTracking':
            return makePlayerShotTrackingBehaviour(behaviourOptions, environmentCollision, parent);
        case 'playerShotAcceleration':
            return makePlayerShotAccelerationBehaviour(behaviourOptions, environmentCollision, parent);
        default:
            throw new Error('Unsupported bullet behaviour option: ' + behaviourOptions.behaviour);
    }
};
