import React, { useEffect, useRef } from 'react';
import { Animation, Vector3 } from '@babylonjs/core';
import { useName } from '../../hooks/useName';

export const Tumbleweed = React.forwardRef(({ assetName, radius, ...props }, ref) => {;
    const name = useName('TumbleweedActor')
    const planeRef = useRef();

    useEffect(() => {
        Animation.CreateAndStartAnimation(
            name + "spinanim",
            planeRef.current,
            'rotation',
            2,
            1,
            new Vector3(0, 0, 0),
            new Vector3(0, 0, Math.PI * 2),
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )
    }, [name])

    return (
        <transformNode name={name + "transform"} ref={ref} {...props}>
            <plane
                name={name + "plane"}
                ref={planeRef}
                scaling={new Vector3(radius, radius, radius)}
            />
        </transformNode>
    );
});
