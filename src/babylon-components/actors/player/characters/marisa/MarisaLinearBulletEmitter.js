import { Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { keyObject } from '../../../../../components/ControlsContainer';
import { playerShoot } from '../../../../../sounds/SFX';
import { PLAYER_BULLETS_WHEEL_LENGTH } from '../../../../../utils/Constants';
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';
import { allBullets } from '../../../../gameLogic/StaticRefs';
import { useName } from '../../../../hooks/useName';
import { useNormalizedFrameSkip } from '../../../../hooks/useNormalizedFrameSkip';
import { useTarget } from '../../../../hooks/useTarget';

//15 bullets per second
let bulletFrameSkip = 5;

const makeShotInstruction = (powerClass, side) => {
    let shotSources;
    let initialVelocities;
    const sideCoefficient = side === 'right' ? 1 : -1;

    switch (powerClass) {
        case 0:
            shotSources = [new Vector3(0, 0, 0.15)];
            initialVelocities = [new Vector3(0, 0, 0)]
            break;
        case 1:
            shotSources = [new Vector3(0, 0, 0.15)];
            initialVelocities = [new Vector3(0, 0, 0)]
            break;
        case 2:
            shotSources = [
                new Vector3(0, 0, 0.15),
                new Vector3(sideCoefficient * 0.15, 0.15, 0.15),
                new Vector3(sideCoefficient * 0.15, -0.15, 0.15)
            ];
            initialVelocities = [
                new Vector3(0, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0)
            ]
            break;
        case 3:
            shotSources = [
                new Vector3(0, 0, 0.15),
                new Vector3(sideCoefficient * 0.15, 0.15, 0.15),
                new Vector3(sideCoefficient * 0.15, -0.15, 0.15),
                new Vector3(sideCoefficient * 0.3, 0.3, 0.15),
                new Vector3(sideCoefficient * 0.3, 0, 0.15),
                new Vector3(sideCoefficient * 0.3, -0.3, 0.15)
            ];
            initialVelocities = [
                new Vector3(0, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0),
                new Vector3(sideCoefficient * 2, 0, 0),
                new Vector3(sideCoefficient * 4, 0, 0),
                new Vector3(sideCoefficient * 4, 0, 0),
                new Vector3(sideCoefficient * 4, 0, 0)
            ]
            break;
        default:
            throw new Error('Unknown power class ' + powerClass);
    }

    const instruction = {
        type: 'shoot',
        materialOptions: {
            material: 'fresnel',
            color: [0.2, 0.6, 1],
            hasAlpha: true,
            doubleSided: true,
        },
        patternOptions: {
            pattern: 'empty',
            num: PLAYER_BULLETS_WHEEL_LENGTH * shotSources.length,
        },
        meshOptions: {
            mesh: 'marisaBullet',
            radius: 0.5
        },
        behaviourOptions: {
            behaviour: 'playerShot',
            initialVelocities,
            shotSources,
            shotSpeed: 20,
        },
        soundOptions: false,
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const marisaShotPower0L = makeShotInstruction(0, "left");
export const marisaShotPower1L = makeShotInstruction(1, "left");
export const marisaShotPower2L = makeShotInstruction(2, "left");
export const marisaShotPower3L = makeShotInstruction(3, "left");
export const marisaShotPower0R = makeShotInstruction(0, "right");
export const marisaShotPower1R = makeShotInstruction(1, "right");
export const marisaShotPower2R = makeShotInstruction(2, "right");
export const marisaShotPower3R = makeShotInstruction(3, "right");

const shotInstruction = (power, side) => {
    if (side === "left") {
        switch (power) {
            case 0:
                return marisaShotPower0L;
            case 1:
                return marisaShotPower1L;
            case 2:
                return marisaShotPower2L;
            case 3:
                return marisaShotPower3L;
            default:
                throw new Error('Unknown power class')
        }
    }
    if (side === "right") {
        switch (power) {
            case 0:
                return marisaShotPower0R;
            case 1:
                return marisaShotPower1R;
            case 2:
                return marisaShotPower2R;
            case 3:
                return marisaShotPower3R;
            default:
                throw new Error('Unknown power class')
        }
    }

}

export const MarisaLinearBulletEmitter = ({ powerClass, side, ...props }) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const shotFrame = useRef(0);
    const [shotId, setShotId] = useState();
    const target = useTarget();
    const frameSkip = useNormalizedFrameSkip(bulletFrameSkip);
    const name = useName('LinearBulletEmitter');

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, shotInstruction(powerClass, side), false, true);
        setShotId(id);

        return () => {
            allBullets[id].behaviour.disabled = true;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, disposeSingle, powerClass, side]);

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
