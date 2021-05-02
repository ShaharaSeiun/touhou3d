import { Wriggle2 } from '../stage1def/Wriggle2';

/* eslint no-unused-vars: 0 */

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

    map.epochs[0].push({
        type: 'UI',
        action: 'init',
        actors: ["reimu", "wriggle"],
        text: "Hey!"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        text: "Hey Wriggle?"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "Yea Reimu?"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "angry",
        text: "Fuck you"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "dissapoint",
        text: "That wasn't very nice"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "excited",
        text: "I bet you smeel like poo"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "shocked",
        text: "I DO NOT!"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "excited",
        text: "Yea you do"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "That's it! I'm gonna say it"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "tired",
        text: "Say what?"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "N"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "shocked",
        text: "OH GOD NO"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'nextEpoch',
    })

    map.epochs.push([]);

    map.epochs[1].push({
        type: "UI",
        action: 'globalCallback',
        callback: "bossStart",
    })


    return map;
};

export default stage1def;
