import { useCallback, useContext } from 'react';
import { bossDeathQuiet, enemyDeath, playerBombCharge } from '../../sounds/SFX';
import { makeParticleSystem } from '../effects/makeParticleSystem';
import { AssetsContext } from './GeneralContainer';

const effectSoundMap = {
    death: enemyDeath,
    bombChargeReimu: playerBombCharge,
    bombChargeMarisa: playerBombCharge,
    chargeWriggle: playerBombCharge,
    newPhaseWriggle: bossDeathQuiet
}

export const useEffects = (assets) => {
    const backupAssets = useContext(AssetsContext);
    if (!assets) assets = backupAssets;

    const addEffect = useCallback((emitter, effectOptions) => {
        switch (effectOptions.type) {
            case 'particles':
                const particleSystem = makeParticleSystem(assets, effectOptions.name + "Particles", emitter);
                particleSystem.start();

                const sound = effectSoundMap[effectOptions.name];
                if (sound) sound.play();

                window.setTimeout(() => {
                    particleSystem.stop();
                }, effectOptions.duration || 20);
                break;
            default:
                throw new Error('Unknown effect type' + effectOptions.type);
        }
    }, [assets]);

    return addEffect;
};
