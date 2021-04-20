export const InertOrbitMinionDef = (radius = 0.5) => {
    const map = {
        movementProps: {
            type: 'empty',
        },
        meshProps:{
            type: 'minion',
        },
        behaviourProps: {
            type: 'inertMinion',
        },
        radius,
        health: 10,
    };

    return map;
};
