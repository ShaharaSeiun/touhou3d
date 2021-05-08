import { DynamicTexture } from '@babylonjs/core';
import React, { useMemo } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { globals } from '../../../../components/GlobalsContainer';
import { LS } from '../../../../components/LSContainer';
import { textOnCtx } from '../../../BabylonUtils';
import { UIPlane } from '../../../ui/UIPlane';

export const PlayerUIRight = ({ ...props }) => {
    const textTexture = useMemo(() => new DynamicTexture('UILeftTexture', { width: 1024, height: 512 }), []);

    useBeforeRender(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = 'white';
        textOnCtx(ctx, `HiScore: `, 0.12, 0.05, 0.2, textColor);
        textOnCtx(ctx, `Score: `, 0.12, 0.05, 0.35, textColor);
        textOnCtx(ctx, `Player: `, 0.12, 0.05, 0.5, textColor);
        textOnCtx(ctx, `Bomb: `, 0.12, 0.05, 0.65, textColor);

        textOnCtx(ctx, `${Math.round(Math.max(LS.HIGHEST_SCORE, globals.SCORE))}`, 0.12, 0.4, 0.2, textColor);
        textOnCtx(ctx, `${Math.round(globals.SCORE)}`, 0.12, 0.4, 0.35, textColor);
        textOnCtx(ctx, `${'★'.repeat(Math.round(globals.PLAYER))}`, 0.12, 0.4, 0.5, textColor);
        textOnCtx(ctx, `${'★'.repeat(Math.round(globals.BOMB))}`, 0.12, 0.4, 0.65, textColor);

        textTexture.update();
    });

    return (
        <UIPlane name="UILeftPlane" {...props} width={1} height={0.5}>
            <standardMaterial
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name="UILeftMaterial"
                diffuseTexture={textTexture}
                emissiveTexture={textTexture}
            />
        </UIPlane>
    );
};
