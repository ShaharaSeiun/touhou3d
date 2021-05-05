import { Animation, Color3, EasingFunction, SineEase, Vector3 } from '@babylonjs/core'
import React, { useEffect, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { useGlowLayer } from '../../gameLogic/useGlowLayer'
import { useName } from '../../hooks/useName'
import { useTexture } from '../../hooks/useTexture'

export const Targeting = ({ radius }) => {
    const planeRef = useRef()
    const texture = useTexture("targeting")
    const name = useName("targeting")
    const scene = useScene()
    const glowLayer = useGlowLayer();

    useEffect(() => {
        const sineAnimation = new Animation(name + "sineAnimation", "scaling", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysSineAnimation = [];
        keysSineAnimation.push({ frame: 0, value: new Vector3(1, 1, 1) });
        keysSineAnimation.push({ frame: 30, value: new Vector3(1.1, 1.1, 1.1) });
        keysSineAnimation.push({ frame: 60, value: new Vector3(1, 1, 1) });
        sineAnimation.setKeys(keysSineAnimation);

        const cubicEasing = new SineEase();
        cubicEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        sineAnimation.setEasingFunction(cubicEasing);

        const plane = planeRef.current;

        plane.animations.push(sineAnimation);
        scene.beginAnimation(plane, 0, 60, true);
        glowLayer.addIncludedOnlyMesh(plane);

        return () => {
            glowLayer.removeIncludedOnlyMesh(plane)
        }
    }, [glowLayer, name, scene])

    return (
        <plane ref={planeRef} name={name} width={radius * 3} height={radius * 3} position={new Vector3(0, 0, 0)} renderingGroupId={1}>
            <standardMaterial
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name={name + "mat"}
                diffuseTexture={texture}
                emissiveColor={new Color3(0.8, 0, 0)}
            />
        </plane>
    )
}
