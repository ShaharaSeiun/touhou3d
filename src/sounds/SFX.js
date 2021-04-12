import MultiSound from './MultiSound';
import LoopingSound from './LoopingSound';

export const choiceSound = new MultiSound('/sfx/select00.wav', 0.2);
export const selectSound = new MultiSound('/sfx/ok00.wav', 0.2);
export const backSound = new MultiSound('/sfx/cancel00.wav', 0.2);
export const enemyDamage = new MultiSound('/sfx/se_damage00.wav', 0.2, 2);
export const enemyDeath = new MultiSound('/sfx/se_enep00.wav', 0.2);
export const enemyShoot = new MultiSound('/sfx/se_tan00.wav', 0.05);
export const enemyChangeBullet = new MultiSound('/sfx/se_kira00.wav', 0.05);
export const minionSpawn = new MultiSound('/sfx/se_option.wav', 0.20);
export const itemGet = new MultiSound('/sfx/se_item00.wav', 0.05);
export const playerShoot = new LoopingSound('/sfx/plst00.wav', 0.1, 2);
export const playerBombCharge = new MultiSound('/sfx/se_power0.wav', 0.5);
export const playerBombShoot = new MultiSound('/sfx/se_tan00.wav', 0.1);
export const playerPowerUp = new MultiSound('/sfx/se_powerup.wav', 0.3);
export const playerGraze = new MultiSound('/sfx/se_graze.wav', 0.1);
export const playerDeath = new MultiSound('/sfx/se_pldead00.wav', 0.1);
