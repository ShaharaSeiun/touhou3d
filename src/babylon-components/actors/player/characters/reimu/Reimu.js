import { Animation, BezierCurveEase, Color3, Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { useName } from '../../../../hooks/useName';
import { useTexture } from '../../../../hooks/useTexture';
import { useKeydown } from '../../../../../hooks/useKeydown';
import { useEffects } from '../../../../gameLogic/useEffects';
import { ReimuBombObject } from './ReimuBombObject';
import { useDoSequence } from '../../../../hooks/useDoSequence';
import { AnimationContext } from '../../../../gameLogic/GeneralContainer';
import { globals, GlobalsContext } from '../../../../../components/GlobalsContainer';
import { calcPowerClass } from '../../PlayerUtils';
import { InvulnerabilityField } from '../../InvulnerabilityField';
import { PLAYER_BOMB_DURATION, PLAYER_INVULNERABLE_COOLDOWN } from '../../../../../utils/Constants';
import { useAddBulletGroup } from '../../../../hooks/useAddBulletGroup';
import { BULLET_TYPE } from '../../../../bullets/behaviours/EnemyBulletBehaviour';
import { ReimuOrb } from './ReimuOrb';

const deathInstruction = {
    type: 'shoot',
    materialOptions: {
        material: 'item',
        texture: 'power',
        doubleSided: true,
        hasAlpha: true,
    },
    patternOptions: {
        pattern: 'arc',
        num: 7,
        from: [1, 0, 10],
        to: [-1, 0, 10],
        speed: 80,
        radius: 5
    },
    meshOptions: {
        mesh: 'item',
    },
    behaviourOptions: {
        behaviour: 'item',
        bulletType: BULLET_TYPE.POWER,
    },
    lifespan: 20,
    wait: 0,
}

export const Reimu = () => {
    const transformNodeRef = useRef();
    const sphereTransformNodeRef = useRef();
    const startPlayer = useMemo(() => globals.PLAYER, [])
    const [player, setPlayer] = useState(globals.PLAYER)
    const name = useName('reimu');
    const [isBombing, setIsBombing] = useState(false);
    const { registerAnimation } = useContext(AnimationContext);
    const { setGlobal } = useContext(GlobalsContext);
    const [powerClass, setPowerClass] = useState(0);
    const [isInvulnerable, setIsInvulnerable] = useState(false);
    const deathTexture = useTexture("reimuDeath");
    const addEffect = useEffects();
    const addBulletGroup = useAddBulletGroup();
    
    useKeydown('BOMB', () => {
        if (!globals.BOMB || isBombing) return;
        setGlobal('BOMB', globals.BOMB - 1);
        setIsBombing(true);
    });

    const bombingTimings = useMemo(() => [0, PLAYER_BOMB_DURATION], []);

    const bombingActions = useMemo(
        () => [
            () => {
                addEffect(sphereTransformNodeRef.current, 'reimuBombCharge');

                let easingFunction = new BezierCurveEase(0.33, 0.01, 0.66, 0.99);
                registerAnimation(
                    Animation.CreateAndStartAnimation(
                        'anim',
                        sphereTransformNodeRef.current,
                        'rotation',
                        60,
                        300,
                        new Vector3(0, 0, 0),
                        new Vector3(0, 0, Math.PI * 16),
                        Animation.ANIMATIONLOOPMODE_CONSTANT,
                        easingFunction
                    )
                );
            },
            () => {
                setIsBombing(false);
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useDoSequence(isBombing, transformNodeRef, bombingTimings, bombingActions);
    
    useEffect(() => {
        if(player !== startPlayer){
            setIsInvulnerable(true);
            addBulletGroup(
                transformNodeRef.current,
                deathInstruction
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player])

    const invulnerableTimings = useMemo(() => [PLAYER_INVULNERABLE_COOLDOWN], []);
    const invulnerableActions = useMemo(() => [
        () => {
            setIsInvulnerable(false);
        }
    ], []);
    useDoSequence(isInvulnerable, transformNodeRef, invulnerableTimings, invulnerableActions);

    useBeforeRender(() => {
        const curPowerClass = calcPowerClass(globals.POWER);
        if (curPowerClass !== powerClass) setPowerClass(curPowerClass);

        const curPlayer = globals.PLAYER;
        if (curPlayer !== player) setPlayer(curPlayer);
    });

    return (
        <transformNode name={name} ref={transformNodeRef}>
            <transformNode name={name + 'sphereTransformNode'} position={new Vector3(0, 0, 1)} ref={sphereTransformNodeRef}>
                <ReimuOrb isBombing={isBombing} powerClass={powerClass} side={'right'} isInvulnerable={isInvulnerable}/>
                <ReimuOrb isBombing={isBombing} powerClass={powerClass} side={'left'} isInvulnerable={isInvulnerable}/>
            </transformNode>
            <transformNode name="bombObjectTransformNode" position={new Vector3(0, 0, 1)}>
                <InvulnerabilityField
                    active={isInvulnerable || isBombing}
                    radius={isInvulnerable ? [5, 500, 5] : 2} 
                    texture={isInvulnerable ? deathTexture : false}
                />
                {isBombing && (
                    <>
                        <ReimuBombObject
                            id={0}
                            color={new Color3(0, 0, 1)}
                            delay={2.0}
                            position={new Vector3(0.3 * Math.cos(0.897 * 0), 0.3 * Math.sin(0.897 * 0), 0)}
                        />
                        <ReimuBombObject
                            id={1}
                            color={new Color3(0, 1, 0)}
                            delay={2.133}
                            position={new Vector3(0.3 * Math.cos(0.897 * 1), 0.3 * Math.sin(0.897 * 1), 0)}
                        />
                        <ReimuBombObject
                            id={2}
                            color={new Color3(0, 1, 1)}
                            delay={2.332}
                            position={new Vector3(0.3 * Math.cos(0.897 * 2), 0.3 * Math.sin(0.897 * 2), 0)}
                        />
                        <ReimuBombObject
                            id={3}
                            color={new Color3(1, 0, 0)}
                            delay={2.634}
                            position={new Vector3(0.3 * Math.cos(0.897 * 3), 0.3 * Math.sin(0.897 * 3), 0)}
                        />
                        <ReimuBombObject
                            id={4}
                            color={new Color3(1, 0, 1)}
                            delay={2.889}
                            position={new Vector3(0.3 * Math.cos(0.897 * 4), 0.3 * Math.sin(0.897 * 4), 0)}
                        />
                        <ReimuBombObject
                            id={5}
                            color={new Color3(1, 1, 0)}
                            delay={3.128}
                            position={new Vector3(0.3 * Math.cos(0.897 * 5), 0.3 * Math.sin(0.897 * 5), 0)}
                        />
                        <ReimuBombObject
                            id={6}
                            color={new Color3(1, 0.5, 0)}
                            delay={3.322}
                            position={new Vector3(0.3 * Math.cos(0.897 * 6), 0.3 * Math.sin(0.897 * 6), 0)}
                        />
                    </>
                )}
            </transformNode>
        </transformNode>
    );
};
