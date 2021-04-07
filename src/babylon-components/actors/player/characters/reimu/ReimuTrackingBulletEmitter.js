import React, { useContext, useRef, useState } from 'react'
import { BulletsContext } from '../../../../gameLogic/GeneralContainer';

const shotInstruction = (powerClass, initialVelocity) => {
    let shotSources;

    switch(powerClass){
        case 0:
            throw new Error('Tracking bullets should not be enabled for a power class of 0');
        case 1:
            shotSources = [new Vector3(0, 0, 0.15)];
            break;
        case 2:
        case 3:
            shotSources = [
                new Vector3(0, 0.3, 0.15), 
                new Vector3(0, -0.3, 0.15)
            ];
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
            behaviour: 'playerShotTracking',
            initialShotVector: initialVelocity,
            shotSources: shotSources,
            shotSpeed: 20,
        },
        lifespan: Infinity,
        wait: 0,
    };

    return instruction;
};

export const ReimuTrackingBulletEmitter = ({powerClass, ...props}) => {
    const transformNodeRef = useRef();
    const { addBulletGroup, disposeSingle } = useContext(BulletsContext);
    const shotFrame = useRef(0)
    const SHOOT = useControl('SHOOT');
    const [shotId, setShotId] = useState()

    useEffect(() => {
        if (!transformNodeRef.current) return;

        const id = addBulletGroup(transformNodeRef.current, shotInstruction(powerClass));
        setShotId(id);

        return () => {
            allBullets[id].behaviour.firing = false;
            window.setTimeout(() => {
                disposeSingle(id);
            }, 5000);
        };
    }, [addBulletGroup, dispose, powerClass]);

    useBeforeRender((scene) => {
        if (!transformNodeRef.current) return;

        shotFrame.current += 1;

        allBullets[shotId].behaviour.firing = false;
        allBullets[shotId].behaviour.target = target;

        if (SHOOT && !scene.paused) {
            playerShoot.play();
        } else {
            playerShoot.stop();
        }

        if (transformNodeRef.current.shotFrame > frameSkip) {
            if (SHOOT && !scene.paused) {
                allBullets[shotId].behaviour.firing = true;
            }
            shotFrame.current = 0;
        }
    });

    return (
        <transformNode ref={transformNodeRef} {...props}/>
    )
}
