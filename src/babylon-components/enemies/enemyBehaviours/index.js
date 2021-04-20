import { RandomEnemyBehaviour } from './RandomEnemyBehaviour';
import { DefaultFairyBehaviour } from './DefaultFairyBehaviour';
import { StrongStage1FairyBehaviour } from './StrongStage1FairyBehaviour';
import { InertMinionBehaviour } from './InertMinionBehaviour';
import { StrongerStage1FairyBehaviour } from './StrongerStage1FairyBehaviour';
import { Stage1MinionBehaviour } from './Stage1MinionBehaviour';
import { TumbleweedBehaviour } from './TumbleweedBehaviour';
import { BOSS_WriggleBehaviour2 } from './BOSS_WriggleBehaviour2';

export const makeEnemyBehaviour = (type) => {
    let BehaviourClass;
    switch (type) {
        case 'random':
            BehaviourClass = RandomEnemyBehaviour;
            break;
        case 'orbitMinion':
            BehaviourClass = InertMinionBehaviour;
            break;
        case 'tumbleweed':
            BehaviourClass = TumbleweedBehaviour;
            break;
        case 'stage1Minion':
            BehaviourClass = Stage1MinionBehaviour;
            break;
        case 'defaultFairy':
            BehaviourClass = DefaultFairyBehaviour;
            break;
        case 'strongStage1Fairy':
            BehaviourClass = StrongStage1FairyBehaviour;
            break;
        case 'strongerStage1Fairy':
            BehaviourClass = StrongerStage1FairyBehaviour;
            break;  
        case 'wriggle2':
            BehaviourClass =  BOSS_WriggleBehaviour2;
            break;  
        default:
            throw new Error('Unknown Enemy Behaviour type: ' + type);
    }

    return BehaviourClass;
}