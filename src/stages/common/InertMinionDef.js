export const InertMinionDef = (radius = 0.5) => {
    const map = {
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
