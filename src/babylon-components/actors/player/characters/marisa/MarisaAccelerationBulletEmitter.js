import { Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { playerShoot } from '../../../../../sounds/SFX';
import { PLAYER_BULLETS_WHEEL_LENGTH } from '../../../../../utils/Constants';
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';
import { allBullets } from '../../../../gameLogic/StaticRefs';
import { useControl } from '../../../../hooks/useControl';
import { useTarget } from '../../../../hooks/useTarget';
import { useNormalizedFrameSkip } from '../../../../hooks/useNormalizedFrameSkip';
import { useName } from '../../../../hooks/useName';

//15 bullets per second
let bulletFrameSkip = 5;

const makeShotInstruction = (powerClass, initialVelocity) => {
    let shotSources;

    switch (powerClass) {
        case 0:
            throw new Error('Acceleration bullets should not be enabled for a power class of 0');
        case 1:
            shotSources = [new Vector3(0, 0, 0.15)];
            break;
        case 2:
            shotSources = [new Vector3(0, 0, 0.15)];
            break;
        case 3:
            shotSources = [new Vector3(0, 0.3, 0.15), new Vector3(0, -0.3, 0.15)];
            break;
        default:
            throw new Error('Unknown power class ' + powerClass);
    }

    const instruction = {
        type: 'shoot',
        materialOptions: {
            material: 'texture',
            texture: 'reimu_ofuda_blue',
            hasAlpha: true,
            doubleSided: true,
        },
        patternOptions: {
            pattern: 'empty',
            num: PLAYER_BULLETS_WHEEL_LENGTH * shotSources.length,
        },
        meshOptions: {
            mesh: 'card',
        },
        behaviourOptions: {
            behaviour: 'playerShotAcceleration',
            initialShotVector: initialVelocity,
            shotSources: shotSources,
            shotSpeed: 20,
        },
        soundOptions: false,
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const MarisaAccelerationBulletEmitter = ({ powerClass, initialVelocity, ...props }) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const shotFrame = useRef(0);
    const [shotId, setShotId] = useState();
    const SHOOT = useControl('SHOOT');
    const target = useTarget();
    const frameSkip = useNormalizedFrameSkip(bulletFrameSkip);
    const name = useName('AccelerationBulletEmitter');

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, makeShotInstruction(powerClass, initialVelocity));
        setShotId(id);

        return () => {
            allBullets[id].behaviour.disabled = true;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, disposeSingle, powerClass, initialVelocity]);

    useBeforeRender((scene) => {
        if (!transformNodeRef.current || !shotId) return;

        shotFrame.current += 1;

        allBullets[shotId].behaviour.firing = false;
        allBullets[shotId].behaviour.target = target;

        if (SHOOT && !scene.paused) {
            playerShoot.play();
        } else {
            playerShoot.stop();
        }

        if (shotFrame.current > frameSkip) {
            if (SHOOT && !scene.paused) {
                allBullets[shotId].behaviour.firing = true;
            }
            shotFrame.current = 0;
        }
    });

    return <transformNode name={name} ref={transformNodeRef} {...props} />;
};
