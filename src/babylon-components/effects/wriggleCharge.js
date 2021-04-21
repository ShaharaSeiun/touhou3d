import { playerBombCharge } from "../../sounds/SFX";
import { makeParticleSystem } from "./makeParticleSystem";

export const wriggleCharge = (emitter, assets) => {
    const particleSystem = makeParticleSystem(assets, 'chargeWriggle', emitter);
    particleSystem.start();
    playerBombCharge.play();

    window.setTimeout(() => {
        particleSystem.stop();
    }, 1000);
};