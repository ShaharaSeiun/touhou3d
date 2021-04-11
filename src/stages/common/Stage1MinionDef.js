export const Stage1MinionDef = (radius = 0.5) => {
    const map = {
        type: 'minion',
        behaviour: 'stage1Minion',
        radius,
        health: 10,
    };

    return map;
};
