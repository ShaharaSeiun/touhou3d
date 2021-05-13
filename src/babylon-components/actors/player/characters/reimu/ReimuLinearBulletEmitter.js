import { Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { keyObject } from '../../../../../components/ControlsContainer';
import { playerShoot } from '../../../../../sounds/SFX';
import { DEV_OVERPOWERED, PLAYER_BULLETS_WHEEL_LENGTH } from '../../../../../utils/Constants';
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';
import { allBullets } from '../../../../gameLogic/StaticRefs';
import { useName } from '../../../../hooks/useName';
import { useNormalizedFrameSkip } from '../../../../hooks/useNormalizedFrameSkip';
import { useTarget } from '../../../../hooks/useTarget';

//15 bullets per second
let bulletFrameSkip = 5;

const makeShotInstruction = (powerClass) => {
    let shotSources;

    switch (powerClass) {
        case 0:
        case 1:
            shotSources = [new Vector3(0, 0, 0.15)];
            break;
        case 2:
        case 3:
            shotSources = [
                new Vector3(0.3 * Math.cos(2.09 * 0), 0.3 * Math.sin(2.09 * 0), 0.15),
                new Vector3(0.3 * Math.cos(2.09 * 1), 0.3 * Math.sin(2.09 * 1), 0.15),
                new Vector3(0.3 * Math.cos(2.09 * 2), 0.3 * Math.sin(2.09 * 2), 0.15),
            ];
            break;
        default:
            throw new Error('Unknown power class ' + powerClass);
    }

    const instruction = {
        type: 'shoot',
        materialOptions: {
            material: 'texture',
            texture: 'reimu_ofuda',
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
            behaviour: 'playerShot',
            bulletValue: DEV_OVERPOWERED ? 50 : 1,
            shotSources: shotSources,
            shotSpeed: 20,
        },
        soundOptions: false,
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const ReimuLinearBulletEmitter = ({ powerClass, ...props }) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const shotFrame = useRef(0);
    const [shotId, setShotId] = useState();
    const target = useTarget();
    const frameSkip = useNormalizedFrameSkip(bulletFrameSkip);
    const name = useName('LinearBulletEmitter');

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, makeShotInstruction(powerClass), false, true);
        setShotId(id);

        return () => {
            allBullets[id].behaviour.disabled = true;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, disposeSingle, powerClass]);

    useBeforeRender((scene) => {
        if (!transformNodeRef.current) return;

        shotFrame.current += 1;

        allBullets[shotId].behaviour.firing = false;
        allBullets[shotId].behaviour.target = target;
        const SHOOT = keyObject.metaDownKeys['SHOOT'];

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
