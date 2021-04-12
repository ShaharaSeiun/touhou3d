import { DynamicTexture, Vector3 } from '@babylonjs/core';
import { clamp } from 'lodash';
import React, { useMemo, useRef } from 'react';
import { useBeforeRender } from 'react-babylonjs';
import { CHARACTER_CONSTS } from '../../utils/Constants';
import { capFirst, rerange } from '../../utils/Utils';
import { arcOnCtx, textOnCtx } from '../BabylonUtils';
import { globalActorRefs } from '../gameLogic/StaticRefs';

export const BossUI = ({ bossUIProps }) => {
    const {bossName} = bossUIProps;
    const bossUIRef = useRef()
    const textTexture = useMemo(() => new DynamicTexture('bossUITexture', { width: 512, height: 512 }), []);


    useBeforeRender(() => {
        textTexture.hasAlpha = true;
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = CHARACTER_CONSTS[bossName].color;
        textOnCtx(ctx, capFirst(bossName), 0.1, 0.5, 0.1, textColor, undefined, undefined, true);

        const bossHealth = globalActorRefs.enemies[0].health;


        const currentLife = bossUIProps.lives.find(life => {
            return life.healthStart >= bossHealth
        })

        if(!currentLife) return;

        const normalHealthRemaining = bossHealth - (currentLife.spellCards[0] + currentLife.healthEnd);
        const normalHealthPerc = clamp(normalHealthRemaining/(currentLife.spellCards[0] + currentLife.healthEnd), 0, 1)
        const normalPerc = rerange(normalHealthPerc, 0, 1, currentLife.spellCards.length / 8, 1)

        arcOnCtx(ctx, currentLife.spellCards.length / 8, normalPerc, "#000000")

        currentLife.spellCards.forEach((spellCardHealthStart, i) => {
            const inverseI = (currentLife.spellCards.length - 1) - i; 
            const nextBossHealth = (currentLife.spellCards?.[i + 1] || 0);
            const spellCardHealthTotal = spellCardHealthStart - nextBossHealth;
            const spellHealthRemaining = (bossHealth - nextBossHealth);
            const spellCarcPerc = clamp(spellHealthRemaining/spellCardHealthTotal, 0, 1)
            if(spellCarcPerc > 0){
                arcOnCtx(ctx, 0, (inverseI / 8) + (spellCarcPerc / 8), `rgb(${64 * inverseI + 127}, 0, 0)`)
            }
        })

        textTexture.update();

        bossUIRef.current.position.copyFrom(globalActorRefs.enemies[0].position)
    })

    return (
        <plane ref={bossUIRef} name="bossUIPlane" width={5} height={5} position={new Vector3(-510, -510, -510)}>
            <standardMaterial
                disableLighting={true}
                useAlphaFromDiffuseTexture
                name="bossUIMaterial"
                diffuseTexture={textTexture}
                emissiveTexture={textTexture}
            />
        </plane>
    );
};
