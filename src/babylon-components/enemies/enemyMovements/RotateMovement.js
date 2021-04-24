import { Animation, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react'
import { minionSpawn } from '../../../sounds/SFX';
import { randVectorToPosition } from '../../BabylonUtils';
import { useName } from '../../hooks/useName';

export const RotateMovement = ({children, spawn, targetDist, reverse, armTime}) => {
    const rotateAroundRef = useRef()
    const armRef = useRef();
    const name = useName('RotateMovement')
    const armStartPosition = useMemo(() => randVectorToPosition(spawn), [spawn])
    const startPosition = useMemo(() => new Vector3(0, 0, 0), [])

    useEffect(() => {
        minionSpawn.play()
        Animation.CreateAndStartAnimation(
            'anim',
            armRef.current,
            'position',
            1,
            armTime || 1,
            armStartPosition,
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
            new Vector3(0, 0, reverse ? Math.PI * 2 : -Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )
    }, [name, targetDist, armStartPosition, reverse, armTime])

    return (
        <transformNode name={name + "rotateAround"} position={startPosition} ref={rotateAroundRef}>
            <transformNode name={name + "arm"} position={armStartPosition} ref={armRef}>
                {children}
            </transformNode>
        </transformNode>
    )
}
