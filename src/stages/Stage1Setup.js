import { marisaShotPower0L, marisaShotPower0R, marisaShotPower1L, marisaShotPower1R, marisaShotPower2L, marisaShotPower2R, marisaShotPower3L, marisaShotPower3R } from "../babylon-components/actors/player/characters/marisa/MarisaLinearBulletEmitter"
import { extraFlower1, extraFlower2, extraFlower3, extraSpray, extraSprayBigSphere, extraSprayFreezeAndTurnYellow } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wriggleExtraPhase1SpellCard"
import { slash1, slash2, slash3, slash4, slash5, slash6, slash7, slash8 } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase1Normal"
import { greenBurst1, greenBurst2, greenBurst3, greenBurst4 } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase2Normal"
import { flower1, flower2, flower3, spray, sprayBigSphere, sprayFreezeAndTurnYellow } from "../babylon-components/enemies/enemyBehaviours/BOSS_WriggleBehaviourTrunk/wrigglePhase2SpellCard"
import { whiteSmall, yellowSmall } from "../babylon-components/enemies/enemyBehaviours/Stage1MinionBehaviour"

export const setupStage1 = (preComputeBulletGroup) => {
    preComputeBulletGroup(marisaShotPower0L)
    preComputeBulletGroup(marisaShotPower1L)
    preComputeBulletGroup(marisaShotPower2L)
    preComputeBulletGroup(marisaShotPower3L)
    preComputeBulletGroup(marisaShotPower0R)
    preComputeBulletGroup(marisaShotPower1R)
    preComputeBulletGroup(marisaShotPower2R)
    preComputeBulletGroup(marisaShotPower3R)

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
    preComputeBulletGroup(whiteSmall);
}