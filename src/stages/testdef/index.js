import { Wriggle1 } from "../stage1def/Wriggle1";
import { Wriggle2 } from "../stage1def/Wriggle2";

const testdef = () => {
    const map = {
        epochs: [[]],
    };

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: Wriggle1(),
        wait: .800
    })

    return map;
}

export default testdef;