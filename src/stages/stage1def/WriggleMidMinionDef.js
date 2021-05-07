import { Vector3 } from "@babylonjs/core";

export const WriggleMidMinionDef = ({ spawn, targetDist = 10, reverse = false, armTime = 5, rotationSpeed = 1 }) => {
    const map = {
        movementProps: {
            type: 'rotate',
            spawn,
            reverse,
            targetDist,
            armTime,
            rotationAxis: new Vector3(0, 1, 0),
            rotationSpeed
        },
        meshProps: {
            type: 'minion',
            disableTrail: true
        },
        behaviourProps: {
            type: 'wriggleMidMinion',
            forward: spawn
        },
        radius: 0.6,
        health: 10,
    };

    return map;
};