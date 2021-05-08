
/* eslint no-unused-vars: 0 */

import { DefaultFairy } from "../stage1def/DefaultFairy";

const stage1def = () => {
    const map = {
        epochs: [[]],
    };


    for (let i = 0; i < 30; i++) {
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, 1], [-1, 1], [1, 0.9]], [0, 0, 0]),
            wait: .5
        })
    }


    return map;
};

export default stage1def;
