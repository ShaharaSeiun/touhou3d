export const burst1 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [1, 1, 0]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 4000,
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
        radius: 0.15
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}

export const burst2 = {
    type: 'shoot',
    materialOptions: {
        material: 'fresnel',
        color: [0, 1, 1]
    },
    patternOptions: {
        pattern: 'multiBurst',
        num: 4000,
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
        radius: 0.15
    },
    behaviourOptions: {
        behaviour: 'slowToStop',
    },
    lifespan: 10,
    wait: 0,
}