import { Animation, Color3, EasingFunction, SineEase, Space, Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useName } from '../../../../hooks/useName';
import { useKeydown, useKeyup } from '../../../../../hooks/useKeydown';
import { useDoSequence } from '../../../../hooks/useDoSequence';
import { GlowContext } from '../../../../gameLogic/GeneralContainer';
import { PlayerUILeft } from '../PlayerUILeft';
import { PlayerUIRight } from '../PlayerUIRight';
import { ReimuLinearBulletEmitter } from './ReimuLinearBulletEmitter';
import { ReimuTrackingBulletEmitter } from './ReimuTrackingBulletEmitter';
import { PLAYER_INVULNERABLE_COOLDOWN } from '../../../../../utils/Constants';
import { times } from 'lodash';
import { useTexture } from '../../../../hooks/useTexture';
import { useTarget } from '../../../../hooks/useTarget';

const UIPosition = new Vector3(0, -0.6, 0);

export const MarisaMagicCircle = ({isBombing, powerClass, side, isInvulnerable}) => {
    const name = useName("MarisaMagicCircle")
    const sphereTransformRef = useRef();
    const planeRef = useRef();
    const smallPlaneRef = useRef();
    const sideCoefficient = useMemo(() => side === 'right' ? 1 : -1, [side])
    const UIClass = useMemo(() => side === 'right' ? PlayerUIRight : PlayerUILeft, [side])
    const linearBulletEmitterPosition = useMemo(() => new Vector3(sideCoefficient * 0.15, 0, 0), [sideCoefficient])
    const spherePosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const focusPosition = useMemo(() => new Vector3(sideCoefficient * 0.5, 0, 0), [sideCoefficient])
    const unfocusPosition = useMemo(() => new Vector3(sideCoefficient, 0, 0), [sideCoefficient])
    const trackingInitialVelocity = useMemo(() => [sideCoefficient * 6, 0, 4], [sideCoefficient]);
    const glowLayer = useContext(GlowContext);
    const scene = useScene();
    const rune1 = useTexture("rune1");
    const target = useTarget();

    useKeydown('SLOW', () => {
        Animation.CreateAndStartAnimation(
            'anim',
            sphereTransformRef.current,
            'position',
            60,
            15,
            sphereTransformRef.current.position,
            focusPosition,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    });
    useKeyup('SLOW', () => {
        Animation.CreateAndStartAnimation(
            'anim',
            sphereTransformRef.current,
            'position',
            60,
            15,
            sphereTransformRef.current.position,
            unfocusPosition,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    });

    //sphere blinking
    const invulnerableTimings = useMemo(() => 
        times(40, (num) => {
            return PLAYER_INVULNERABLE_COOLDOWN * num / 40
        }), 
    []);

    const invulnerableActions = useMemo(() => [
        ...times(39, (num) => {
            return () => {
                planeRef.current.isVisible = num % 2 === 0
            }
        }), 
        () => {
            planeRef.current.isVisible = true
        }
    ], []);

    useDoSequence(isInvulnerable, planeRef, invulnerableTimings, invulnerableActions);

    useEffect(() => {
        glowLayer.addIncludedOnlyMesh(planeRef.current)
        const sineAnimation = new Animation(name + "sineAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysSineAnimation = [];
        keysSineAnimation.push({ frame: 0, value: new Vector3(0, 0, 0.5) });
        keysSineAnimation.push({ frame: 30, value: new Vector3(0, 0, 0.4) });
        keysSineAnimation.push({ frame: 60, value: new Vector3(0, 0, 0.5) });
        sineAnimation.setKeys(keysSineAnimation);

        const cubicEasing = new SineEase();
        cubicEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        sineAnimation.setEasingFunction(cubicEasing);

        smallPlaneRef.current.animations.push(sineAnimation);
        scene.beginAnimation(smallPlaneRef.current, 0, 60, true);
    }, [glowLayer, name, scene])

    useBeforeRender(() => {
        if(!target || !planeRef.current) return;

        planeRef.current.lookAt(target, 0, 0, 0, Space.WORLD);
    })

    return (
        <transformNode name={name + 'sphereTransform'} ref={sphereTransformRef} position={spherePosition}>
            {!isBombing && <UIClass position={UIPosition} />}
            <ReimuLinearBulletEmitter position={linearBulletEmitterPosition} powerClass={powerClass} />
            {powerClass > 0 && (
                <ReimuTrackingBulletEmitter initialVelocity={trackingInitialVelocity} powerClass={powerClass} />
            )}
            <plane
                name={name + 'plane'}
                scaling={new Vector3(0.5, 0.5, 0.5)}
                ref={planeRef}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={rune1} emissiveColor={new Color3(0, 1, 0)} name={name + 'planeMat'}/>
                <plane
                    name={name + 'smallPlane'}
                    scaling={new Vector3(0.5, 0.5, 0.5)}
                    position={new Vector3(0, 0, 0.5)}
                    ref={smallPlaneRef}
                >
                    <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={rune1} emissiveColor={new Color3(0, 1, 0)} name={name + 'planeMat'}/>
                </plane>
            </plane>
        </transformNode>
    )
}
