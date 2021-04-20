import { Animation, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react'
import { minionSpawn } from '../../../sounds/SFX';
import { useName } from '../../hooks/useName';

export const RotateMovement = ({children, spawn, targetDist}) => {
    const rotateAroundRef = useRef()
    const armRef = useRef();
    const name = useName('RotateMovement')
    const startPosition = useMemo(() => new Vector3(0, 0, 0), [])

    useEffect(() => {
        minionSpawn.play()
        Animation.CreateAndStartAnimation(
            'anim',
            armRef.current,
            'position',
            1,
            1,
            armRef.current.position,
            armRef.current.position.normalize().scale(targetDist),
            0,
        )
        
        Animation.CreateAndStartAnimation(
            name + "anim",
            rotateAroundRef.current,
            'rotation',
            1,
            4,
            new Vector3(0, 0, 0),
            new Vector3(0, 0, Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )
    }, [name, targetDist])

    return (
        <transformNode name={name + "rotateAround"} position={startPosition} ref={rotateAroundRef}>
            <transformNode name={name + "arm"} position={spawn} ref={armRef}>
                {children}
            </transformNode>
        </transformNode>
    )
}
