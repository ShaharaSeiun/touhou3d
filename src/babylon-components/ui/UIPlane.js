import React, { useRef } from 'react'

export const UIPlane = ({ children, ...props }) => {
    const planeRef = useRef()


    return (
        <plane ref={planeRef} {...props}>
            {children}
        </plane>
    )
}
