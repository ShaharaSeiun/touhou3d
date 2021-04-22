import { playerBombCharge } from '../../sounds/SFX';
import { makeParticleSystem } from './makeParticleSystem';

export const marisaBombCharge = (emitter, assets) => {
    const particleSystem = makeParticleSystem(assets, 'chargeBombMarisa', emitter);
    particleSystem.start();
    playerBombCharge.play();

    window.setTimeout(() => {
        particleSystem.stop();
    }, 1000);
};