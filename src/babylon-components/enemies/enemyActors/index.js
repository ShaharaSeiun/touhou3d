import { FairyBase } from './FairyBase';
import { TempActor } from './TempActor';
import { FairyBaseWithMagicCircle } from './FairyBaseWithMagicCircle';
import { MinionBase } from './MinionBase';
import { Wriggle } from './Wriggle';

export const makeEnemyMesh = (type) => {
    let EnemyMeshClass;

    switch (type) {
        case 'fairy':
            EnemyMeshClass = FairyBase;
            break;
        case 'fairyWithMagicCircle':
            EnemyMeshClass = FairyBaseWithMagicCircle;
            break;
        case 'minion':
            EnemyMeshClass = MinionBase;
            break;
        case 'tempActor':
            EnemyMeshClass = TempActor;
            break;
        case 'wriggle':
            EnemyMeshClass = Wriggle;
            break;
        default:
            throw new Error('Unknown Enemy type: ' + type);
    }

    return EnemyMeshClass;
}