import { Matrix, Quaternion, Vector3 } from '@babylonjs/core';
import { globalActorRefs } from '../../gameLogic/StaticRefs';

export const makeAreaPattern = (patternOptions, parent) => {
    let forwardVector;

    if (patternOptions.towardsPlayer) {
        forwardVector = globalActorRefs.player.position.subtract(parent.getAbsolutePosition()).normalize()
    } 
    else{
        throw new Error("Area pattern not towards player not implemented yet")
    }

    const angle = patternOptions.radialAngle

    const velocities = [];
    const positions = [];

    for(let i = 0; i < patternOptions.num; i++) {
        for(let j = 0; j < patternOptions.num; j++) {
            const xAngle = ((i/(patternOptions.num - 1)) - 0.5) * angle;
            const yAngle = ((j/(patternOptions.num - 1)) - 0.5) * angle;

            const rotationQuaternion = Quaternion.RotationYawPitchRoll(xAngle, yAngle, 0)
            const rotationMatrix = new Matrix();
            rotationQuaternion.toRotationMatrix(rotationMatrix);

            const newForward = Vector3.TransformCoordinates(forwardVector, rotationMatrix);
            velocities.push(newForward.scale(patternOptions.speed || 1))
            positions.push(newForward.scale(patternOptions.radius || 1))
        }
    }

    return {
        positions,
        velocities,
    };
};
