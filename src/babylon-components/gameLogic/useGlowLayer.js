
import { useMemo } from 'react';
import { useScene } from 'react-babylonjs';
import { GlowLayer } from '../GlowLayer';

export const useGlowLayer = () => {
    const scene = useScene();
    const glowLayer = useMemo(() => {
        const glowLayer = new GlowLayer('glow', scene);
        glowLayer.blurKernelSize = 100;
        return glowLayer;
    }, [scene]);
    return glowLayer;
};
