import {marisaShotPower0, marisaShotPower1, marisaShotPower2, marisaShotPower3} from "../babylon-components/actors/player/characters/marisa/MarisaLinearBulletEmitter"
import { extraFlower1, extraFlower2, extraFlower3, extraSpray, extraSprayBigSphere, extraSprayFreezeAndTurnYellow } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wriggleExtraPhase1SpellCard"
import { slash1, slash2, slash3, slash4, slash5, slash6, slash7, slash8 } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase1Normal"
import { greenBurst1, greenBurst2, greenBurst3, greenBurst4 } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase2Normal"
import { flower1, flower2, flower3, spray, sprayBigSphere, sprayFreezeAndTurnYellow } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase2SpellCard"
import { yellowSmall } from "../babylon-components/enemies/enemyBehaviours/Stage1MinionBehaviour"

export const setupStage1 = (preComputeBulletGroup) => {
    preComputeBulletGroup(marisaShotPower0)
    preComputeBulletGroup(marisaShotPower1)
    preComputeBulletGroup(marisaShotPower2)
    preComputeBulletGroup(marisaShotPower3)

    preComputeBulletGroup(slash1)
    preComputeBulletGroup(slash2)
    preComputeBulletGroup(slash3)
    preComputeBulletGroup(slash4)
    preComputeBulletGroup(slash5)
    preComputeBulletGroup(slash6)
    preComputeBulletGroup(slash7)
    preComputeBulletGroup(slash8)

    preComputeBulletGroup(greenBurst1)
    preComputeBulletGroup(greenBurst2)
    preComputeBulletGroup(greenBurst3)
    preComputeBulletGroup(greenBurst4)

    preComputeBulletGroup(spray);
    preComputeBulletGroup(sprayBigSphere);
    preComputeBulletGroup(sprayFreezeAndTurnYellow);
    preComputeBulletGroup(flower1);
    preComputeBulletGroup(flower2);
    preComputeBulletGroup(flower3);

    preComputeBulletGroup(extraSpray);
    preComputeBulletGroup(extraSprayBigSphere);
    preComputeBulletGroup(extraSprayFreezeAndTurnYellow);
    preComputeBulletGroup(extraFlower1);
    preComputeBulletGroup(extraFlower2);
    preComputeBulletGroup(extraFlower3);

    preComputeBulletGroup(yellowSmall);
}