import { DefaultFairy } from "../stage1def/DefaultFairy";

/* eslint no-unused-vars: 0 */

const testdef = () => {
    const map = {
        epochs: [[]],
    };

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: DefaultFairy([1, 0.5, 1], [-1, 0.5, 0]),
        wait: 0
    })


    return map;
}

export default testdef;