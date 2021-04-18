import { DefaultFairy } from './DefaultFairy';
import { StrongStage1Fairy } from './StrongStage1Fairy';
import { StrongerStage1Fairy } from './StrongerStage1Fairy';
import { Tumbleweed } from './Tumbleweed';
import { Wriggle1 } from './Wriggle1';
import { Wriggle2 } from './Wriggle2';

/* eslint no-unused-vars: 0 */

const stage1def = () => {
    const map = {
        epochs: [[]],
    };

    map.epochs[0].push({
        type: 'UI',
        action: 'stageStartQuote',
        text: [
            'Stage 1',
            'Where the Fireflies Fly',
            'Are the fireflies brighter than usual, or is it just your imagination? Tonight will be a long night'
        ],
        wait: 7
    })

    for(let i = 0; i < 12; i++){
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: .50
        })
    }

    map.epochs[0].push({
        type: 'empty',
        wait: 3
    })

    for(let i = 0; i < 12; i++){
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: .50
        })
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: .250
        })
    }

    map.epochs[0].push({
        type: 'empty',
        wait: 2
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongStage1Fairy([-1, 0.5, 1], [1, 0, 0]),
        wait: 0
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongStage1Fairy([1, -0.5, 1], [-1, 0, 0]),
        wait: 2
    })

    for(let i = 0; i < 30; i++){
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, 1], [-1, 1], [1, 0.9]], [0, 0, 0]),
            wait: .1
        })
    }

    map.epochs[0].push({
        type: 'empty',
        wait: 3
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([1, 0, 1], [-1, 0, 0]),
        wait: .800
    })

    map.epochs[0].push({
        type: 'empty',
        wait: 2
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([1, 0.5, 1], [-1, 0.5, 0]),
        wait: 0
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([-1, -0.5, 1], [-1, -0.5, 0]),
        wait: 2
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'nextEpoch',
        wait: 0
    })

    map.epochs.push([]);

    map.epochs[1].push({
        type: 'empty',
        wait: 3
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'init',
        actors: ["reimu", "wriggle"],
        text: "Hey!"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        text: "Hey Wriggle?"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "Yea Reimu?"
    })
    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "angry",
        text: "Fuck you"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "dissapoint",
        text: "That wasn't very nice"
    })
    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "excited",
        text: "I bet you smeel like poo"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "shocked",
        text: "I DO NOT!"
    })
    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "excited",
        text: "Yea you do"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "That's it! I'm gonna say it"
    })
    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "tired",
        text: "Say what?"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "N"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "shocked",
        text: "OH GOD NO"
    })

    map.epochs[1].push({
        type: 'UI',
        action: 'nextEpoch',
    })

    map.epochs.push([]);

    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: Wriggle2(),
        wait: .800
    })

    
    return map;
};

export default stage1def;
