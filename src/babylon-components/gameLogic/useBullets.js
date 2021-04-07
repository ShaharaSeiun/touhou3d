import { useCallback, useContext } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { globals, GlobalsContext } from '../../components/GlobalsContainer';
import { enemyDamage, itemGet } from '../../sounds/SFX';
import { MAX_ENEMIES } from '../../utils/Constants';
import { makeBulletBehaviour } from '../bullets/behaviours';
import { BulletGroup } from '../bullets/BulletGroup';
import { convertPlayerBulletCollisions, convertEnemyBulletCollisions, prepareBulletInstruction } from '../bullets/BulletUtils';
import { makeBulletMaterial } from '../bullets/materials';
import { makeBulletMesh } from '../bullets/meshes';
import { makeBulletPattern } from '../bullets/patterns';
import { makeName } from '../hooks/useName';
import { globalActorRefs, allBullets, killEnemy } from './StaticRefs';

let playHitSound = false;
let framesSincePlayHit = 0;

export const useBullets = (assets, environmentCollision, addEffect) => {
    const scene = useScene();
    const { setGlobal } = useContext(GlobalsContext);

    const disposeSingle = useCallback((id) => {
        allBullets[id].dispose();
        delete allBullets[id];
    }, []);

    const dispose = useCallback((ids) => {
        ids.forEach((id) => {
            allBullets[id].dispose();
            delete allBullets[id];
        });
    }, []);

    const addBulletGroup = useCallback(
        (parent, instruction) => {
            if (!parent) throw new Error('parent not ready!');

            const preparedInstruction = prepareBulletInstruction(instruction);

            const { positions, velocities } = makeBulletPattern(preparedInstruction.patternOptions, parent);
            const material = makeBulletMaterial(preparedInstruction.materialOptions, parent, assets, scene);
            const { mesh, radius } = makeBulletMesh(preparedInstruction.meshOptions, assets, scene);
            const behaviour = makeBulletBehaviour(preparedInstruction.behaviourOptions, environmentCollision, radius, parent);

            mesh.makeInstances(positions.length);
            mesh.material = material;

            behaviour.init(material, positions, velocities, scene);

            const { lifespan } = preparedInstruction;
            const startTime = new Date();

            const bulletGroup = new BulletGroup(material, mesh, behaviour, positions, velocities, lifespan, startTime);

            const newID = makeName('bulletGroup');
            allBullets[newID] = bulletGroup;
            return newID;
        },
        [assets, environmentCollision, scene]
    );

    useBeforeRender(() => {
        //Collisions
        if (playHitSound && framesSincePlayHit % 6 === 0) {
            enemyDamage.play();
            playHitSound = false;
            framesSincePlayHit = 0;
        }
        framesSincePlayHit++;

        Object.values(allBullets).forEach((bulletGroup) => {
            if (bulletGroup.behaviour.isPlayerBullet) {
                bulletGroup.behaviour.collisionTexture1.readPixels().then((buffer) => {
                    const collisions = convertPlayerBulletCollisions(buffer);
                    collisions.forEach((collision) => {
                        if (collision.collisionID >= MAX_ENEMIES && collision.collisionID < MAX_ENEMIES * 2) {
                            const enemyID = collision.collisionID - MAX_ENEMIES;
                            globalActorRefs.enemies[enemyID].health--;
                            playHitSound = true;
                            if (globalActorRefs.enemies[enemyID]) {
                                addEffect(collision.hit, 'hitParticles');
                            }

                            if (globalActorRefs.enemies[enemyID].health <= 0) {
                                killEnemy(enemyID);
                            }
                        }
                    });
                });
            } else {
                bulletGroup.behaviour.collisionResult.readPixels().then((buffer) => {
                    const collisions = convertEnemyBulletCollisions(buffer);
                    if (collisions.length > 0) {
                        const collision = collisions[0];
                        if (collision.point) {
                            setGlobal('POINT', globals.POINT + collision.point / 8);
                            itemGet.play();
                        }
                        if (collision.power) {
                            console.log(collision.power);
                            setGlobal('POWER', Math.min(globals.POWER + collision.power / 8, 120));
                            itemGet.play();
                        }
                    }
                });
            }
        });

        //Lifespans

        let now = new Date();
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;

        const toRemove = [];

        Object.keys(allBullets).forEach((bulletGroupIndex) => {
            const bulletGroup = allBullets[bulletGroupIndex];
            if (now - bulletGroup.startTime > bulletGroup.lifespan) {
                toRemove.push(bulletGroupIndex);
            } else {
                bulletGroup.behaviour.update(deltaS);
            }
        });

        if (toRemove.length > 0) dispose(toRemove);

        globalActorRefs.enemies.forEach((enemy, i) => {
            const offset = i * 3;
            globalActorRefs.enemyPositionBuffer[offset + 0] = enemy.position.x;
            globalActorRefs.enemyPositionBuffer[offset + 1] = enemy.position.y;
            globalActorRefs.enemyPositionBuffer[offset + 2] = enemy.position.z;
            globalActorRefs.enemyRadiiBuffer[i] = enemy.radius;
        });
    });

    return { disposeSingle, dispose, addBulletGroup };
};
