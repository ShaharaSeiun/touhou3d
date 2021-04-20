import { StrongerStage1Fairy } from "../stage1def/StrongerStage1Fairy";
import { Wriggle1 } from "../stage1def/Wriggle1";
import { Wriggle2 } from "../stage1def/Wriggle2";

/* eslint no-unused-vars: 0 */

const testdef = () => {
    const map = {
        epochs: [[]],
    };

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([1, 0.5, 1], [-1, 0.5, 0]),
        wait: 0
    })


    return map;
}

export default testdef;