
/* eslint no-unused-vars: 0 */

import { Wriggle2 } from "../stage1def/Wriggle2";

const stage1def = () => {
    const map = {
        epochs: [[]],
    };


    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: Wriggle2(),
        wait: .800
    })


    return map;
};

export default stage1def;
