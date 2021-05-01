import { Animation, BezierCurveEase, Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { globals, GlobalsContext } from '../../../../components/GlobalsContainer';
import { useKeydown } from '../../../../hooks/useKeydown';
import { PLAYER_BOMB_DURATION, PLAYER_INVULNERABLE_COOLDOWN } from '../../../../utils/Constants';
import { AnimationContext } from '../../../gameLogic/GeneralContainer';
import { useEffects } from '../../../gameLogic/useEffects';
import { useAddBulletGroup } from '../../../hooks/useAddBulletGroup';
import { useDoSequence } from '../../../hooks/useDoSequence';
import { useName } from '../../../hooks/useName';
import { useTexture } from '../../../hooks/useTexture';
import { InvulnerabilityField } from '../InvulnerabilityField';
import { calcPowerClass } from '../PlayerUtils';
import { Marisa } from './marisa/Marisa';
import { MarisaMagicCircle } from './marisa/MarisaMagicCircle';
import { MasterSpark } from './marisa/MasterSpark';
import { playerContinueInstruction, playerDeathInstruction } from './PlayerInstructions';
import { FantasySeal } from './reimu/FantasySeal';
import { Reimu } from './reimu/Reimu';
import { ReimuOrb } from './reimu/ReimuOrb';

export const Player = ({ character }) => {
    const transformNodeRef = useRef();
    const sphereTransformNodeRef = useRef();
    const startPlayer = useMemo(() => globals.PLAYER, [])
    const [player, setPlayer] = useState(globals.PLAYER)
    const name = useName(character + '');
    const [isBombing, setIsBombing] = useState(false);
    const { registerAnimation } = useContext(AnimationContext);
    const { setGlobal } = useContext(GlobalsContext);
    const [powerClass, setPowerClass] = useState(0);
    const [isInvulnerable, setIsInvulnerable] = useState(false);
    const deathTexture = useTexture(character + "Death");
    const addEffect = useEffects();
    const addBulletGroup = useAddBulletGroup();

    const EmitterClass = useMemo(() => {
        switch (character) {
            case 'reimu':
                return ReimuOrb;
            case 'marisa':
                return MarisaMagicCircle
            default:
                throw new Error('unknown character: ' + character);
        }
    }, [character])

    const BombClass = useMemo(() => {
        switch (character) {
            case 'reimu':
                return FantasySeal;
            case 'marisa':
                return MasterSpark;
            default:
                throw new Error('unknown character: ' + character);
        }
    }, [character])

    const MeshClass = useMemo(() => {
        switch (character) {
            case 'reimu':
                return Reimu;
            case 'marisa':
                return Marisa;
            default:
                throw new Error('unknown character: ' + character);
        }
    }, [character])

    useKeydown('BOMB', () => {
        if (!globals.BOMB || isBombing) return;
        setGlobal('BOMB', globals.BOMB - 1);
        setIsBombing(true);
    });

    const bombingTimings = useMemo(() => [0, PLAYER_BOMB_DURATION], []);

    const bombingActions = useMemo(
        () => [
            () => {
                addEffect(sphereTransformNodeRef.current, character + 'BombCharge');

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
        if (player !== startPlayer) {
            setIsInvulnerable(true);
            if (globals.POWER) addBulletGroup(
                transformNodeRef.current,
                player === 0 ? playerContinueInstruction() : playerDeathInstruction(globals.POWER),
                false,
                true
            )
            setGlobal('POWER', 0);
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
            <MeshClass />
            <transformNode name={name + 'sphereTransformNode'} position={new Vector3(0, 0, 1)} ref={sphereTransformNodeRef}>
                <EmitterClass isBombing={isBombing} powerClass={powerClass} side={'right'} isInvulnerable={isInvulnerable} />
                <EmitterClass isBombing={isBombing} powerClass={powerClass} side={'left'} isInvulnerable={isInvulnerable} />
            </transformNode>
            <transformNode name="bombObjectTransformNode" position={new Vector3(0, 0, 1)}>
                <InvulnerabilityField
                    active={isInvulnerable || isBombing}
                    radius={isInvulnerable ? [5, 500, 5] : 2}
                    texture={isInvulnerable ? deathTexture : false}
                />
                {isBombing && (
                    <BombClass />
                )}
            </transformNode>
        </transformNode>
    );
};
