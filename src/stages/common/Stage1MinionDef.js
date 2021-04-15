export const Stage1MinionDef = (radius = 0.5) => {
    const map = {
        meshProps:{
            type: 'minion',
        },
        behaviourProps: {
            type: 'stage1Minion',
        },
        radius,
        health: 10,
    };

    return map;
};
