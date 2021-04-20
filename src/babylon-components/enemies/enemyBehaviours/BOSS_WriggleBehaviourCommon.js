import { Matrix, Quaternion, Vector3 } from '@babylonjs/core';
import { allBullets } from '../../gameLogic/StaticRefs';

export const burst1 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 1, 0]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 5000,
        speeds: [4, 5, 6, 7],
        thetaLength: Math.PI * 1.1,
        thetaStart: -Math.PI/2.5
    },
    endTimings: {
        timing: 'batch',
        times: [1, 1.5, 2, 2.5]
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}

export const burst1_replace1 = (sourceId) => {
    const positions = allBullets[sourceId].behaviour.diffSystem.positionTextures[0];
    const velocities = allBullets[sourceId].velocities.map(velocity => {
        const rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI/2, 0, 0)
        const rotationMatrix = new Matrix();
        rotationQuaternion.toRotationMatrix(rotationMatrix);
        return Vector3.TransformCoordinates(velocity, rotationMatrix);
    });
    const timings = allBullets[sourceId].endTimings;

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [1, 1, 0]
        },
        patternOptions: {
            pattern: 'explicit',
            positions: positions,
            velocities: velocities,
            timings: timings
        },
        meshOptions: {
            mesh: 'egg',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
            reliesOnParent: false,
            disableWarning: true
        },
        soundOptions: {
            sound: 'enemyChangeBullet'
        },
        lifespan: 10,
        wait: 0,
    }
}

export const burst2 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 1]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 5000,
        speeds: [4, 5, 6, 7],
        thetaLength: Math.PI * 1.1,
        thetaStart: Math.PI - 0.5
    },
    endTimings: {
        timing: 'batch',
        times: [1, 1.5, 2, 2.5]
    },
    meshOptions: {
        mesh: 'egg',
        radius: 0.2
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}

export const burst2_replace1 = (sourceId) => {
    const positions = allBullets[sourceId].behaviour.diffSystem.positionTextures[0];
    const velocities = allBullets[sourceId].velocities.map(velocity => {
        const rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI/2, 0, 0)
        const rotationMatrix = new Matrix();
        rotationQuaternion.toRotationMatrix(rotationMatrix);
        return Vector3.TransformCoordinates(velocity, rotationMatrix);
    });
    const timings = allBullets[sourceId].endTimings;

    return {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0, 1, 1]
        },
        patternOptions: {
            pattern: 'explicit',
            positions: positions,
            velocities: velocities,
            timings: timings
        },
        meshOptions: {
            mesh: 'egg',
            radius: 0.2
        },
        behaviourOptions: {
            behaviour: 'linear',
            reliesOnParent: false,
            disableWarning: true
        },
        soundOptions: {
            sound: 'enemyChangeBullet'
        },
        lifespan: 10,
        wait: 0,
    }
}