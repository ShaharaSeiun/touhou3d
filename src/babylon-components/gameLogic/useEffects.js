import { useCallback, useContext } from 'react';
import { genericEnemyDeath } from '../effects/genericEnemyDeath';
import { genericEnemyHit } from '../effects/genericEnemyHit';
import { reimuBombCharge } from '../effects/reimuBombCharge';
import { marisaBombCharge} from '../effects/marisaBombCharge';
import { wriggleCharge } from '../effects/wriggleCharge';
import { AssetsContext } from './GeneralContainer';

export const useEffects = (assets) => {
    const backupAssets = useContext(AssetsContext);
    if (!assets) assets = backupAssets;

    const addEffect = useCallback((emitter, effectName) => {
        switch (effectName) {
            case 'deathParticles':
                genericEnemyDeath(emitter, assets);
                break;
            case 'hitParticles':
                genericEnemyHit(emitter, assets);
                break;
            case 'reimuBombCharge':
                reimuBombCharge(emitter, assets);
                break;
            case 'marisaBombCharge':
                marisaBombCharge(emitter, assets);
                break;
            case 'wriggleCharge':
                wriggleCharge(emitter, assets);
                break;
            default:
                throw new Error('Unknown effect ' + effectName);
        }
    }, [assets]);

    return addEffect;
};
