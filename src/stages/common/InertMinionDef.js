export const InertMinionDef = (radius = 0.5) => {
    const map = {
        type: 'minion',
        behaviour: 'inertMinion',
        radius,
        health: 10,
    };

    return map;
};
