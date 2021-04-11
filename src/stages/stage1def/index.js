import { DefaultFairy } from './DefaultFairy';
import { StrongStage1Fairy } from './StrongStage1Fairy';
import { StrongerStage1Fairy } from './StrongerStage1Fairy';
import { Tumbleweed } from './Tumbleweed';
import { Wriggle1 } from './Wriggle1';

const stage1def = () => {
    const map = {
        epochs: [[]],
    };

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'init',
    //     actors: ["reimu", "wriggle"],
    //     text: "Hey!"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     text: "Hey Wriggle?"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     text: "Yea Reimu?"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "angry",
    //     text: "Fuck you"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     emotion: "dissapoint",
    //     text: "That wasn't very nice"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "excited",
    //     text: "I bet you smeel like poo"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     emotion: "shocked",
    //     text: "I DO NOT!"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "excited",
    //     text: "Yea you do"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     text: "That's it! I'm gonna say it"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "tired",
    //     text: "Say what?"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     text: "N"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "shocked",
    //     text: "OH GOD NO"
    // })

    // return map;

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'stageStartQuote',
    //     text: [
    //         'Stage 1',
    //         'Where the Fireflies Fly',
    //         'Are the fireflies brighter than usual, or is it just your imagination? Tonight will be a long night'
    //     ],
    //     wait: 7.000
    // })

    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: .250
    //     })
    // }

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: StrongerStage1Fairy([1, 0, 1], [-1, 0, 0]),
    //     wait: .800
    // })

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: StrongStage1Fairy([-1, 0, 1], [1, 0, 0]),
    //     wait: .250
    // })


    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: .250
    //     })
    // }

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: StrongStage1Fairy([1, 0, 1], [-1, 0, 0]),
    //     wait: .250
    // })

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: StrongerStage1Fairy([1, 0, 1], [-1, 0, 0]),
    //     wait: .800
    // })

    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: .250
    //     })
    // }

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //     wait: .250
    // })

    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: .250
    //     })
    // }

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: StrongerStage1Fairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //     wait: .250
    // })

    map.epochs[0].push({
        type: 'spawn',
        enemy: Wriggle1(),
        wait: .800
    })

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: StrongStage1Fairy([1, 0, 1], [-1, 0, 0]),
    //     wait: .800
    // })

    

    // map.epochs[0].push({
    //     type: 'spawn',
    //     enemy: Tumbleweed([1, 0, 0], [-1, 0, 0]),
    //     wait: .8000
    // })

    

    
    return map;
};

export default stage1def;
