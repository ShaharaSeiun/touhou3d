import { Texture } from '@babylonjs/core';
import { isFunction } from 'lodash';
import { RandVector3 } from '../../BabylonUtils';
import { preComputedBulletPatterns, preComputedBulletTextures } from '../../gameLogic/StaticRefs';
import { computeSourceTextures } from '../BulletUtils';
import { makeArcPattern } from './Arc';
import { makeAreaPattern } from './Area';
import { makeBurstPattern } from './Burst';
import { makeClawsPattern } from './Claws';
import { makeEmptyPattern } from './Empty';
import { makeMultiAreaPattern } from './MultiArea';
import { makeMultiBurstPattern } from './MultiBurst';
import { makeRandomConePattern } from './RandomCone';
import { makeReplacePattern } from './replace';
import { makeSinglePattern } from './Single';
import { makeSprayPattern } from './Spray';
import { makeSprayStableRandBurstPattern } from './SprayStableRandBurst';

//if there's not a parent, then it's a precompute
export const makeBulletPattern = (patternOptions, parent, scene, supressNotPrecomputedWarning) => {
    let _pattern;

    const uid = patternOptions.uid || JSON.stringify(patternOptions);
    const precomputedBulletPattern = preComputedBulletPatterns[uid];
    if (precomputedBulletPattern && !patternOptions.sourceBulletId) {
        return precomputedBulletPattern;
    }

    if (parent && !patternOptions.sourceBulletId && !supressNotPrecomputedWarning && !patternOptions.towardsPlayer) {
        console.warn("Bullet pattern wasn't precomputed, this is gonna take a while", patternOptions.pattern);
    }

    if (isFunction(patternOptions)) {
        _pattern = patternOptions();
    } else {
        switch (patternOptions.pattern) {
            case 'empty':
                _pattern = makeEmptyPattern(patternOptions, parent);
                break;
            case 'single':
                _pattern = makeSinglePattern(patternOptions, parent);
                break;
            case 'burst':
                _pattern = makeBurstPattern(patternOptions, parent);
                break;
            case 'multiBurst':
                _pattern = makeMultiBurstPattern(patternOptions, parent);
                break;
            case 'sprayStableRandBurst':
                _pattern = makeSprayStableRandBurstPattern(patternOptions, parent);
                break;
            case 'area':
                _pattern = makeAreaPattern(patternOptions, parent);
                break;
            case 'arc':
                _pattern = makeArcPattern(patternOptions, parent);
                break;
            case 'claws':
                _pattern = makeClawsPattern(patternOptions, parent);
                break;
            case 'multiArea':
                _pattern = makeMultiAreaPattern(patternOptions, parent);
                break;
            case 'randomCone':
                _pattern = makeRandomConePattern(patternOptions, parent);
                break;
            case 'spray':
                _pattern = makeSprayPattern(patternOptions, parent);
                break;
            case 'replace':
                _pattern = makeReplacePattern(patternOptions, parent);
                break;
            default:
                throw new Error('Pattern type not supported: ' + patternOptions.pattern);
        }
    }

    if (patternOptions.offset) {
        const offset = new RandVector3(...patternOptions.offset)
        _pattern.positions.forEach(position => position.addInPlace(offset))
    }

    if (!_pattern.timings) {
        if (_pattern.positions instanceof Texture) {
            throw new Error('when timings are not specified, positions must not be texture')
        }
        _pattern.timings = new Array(_pattern.positions.length);
        for (let i = 0; i < _pattern.positions.length; ++i)
            _pattern.timings[i] = 0;
    }

    if (patternOptions.repeat) {
        const newPositions = []
        const newVelocities = []
        const newTimings = []
        for (let i = 0; i < patternOptions.repeat.times; i++) {
            newPositions.push(..._pattern.positions)
            newVelocities.push(..._pattern.velocities)
            newTimings.push(..._pattern.timings.map(timing => (
                timing + i * patternOptions.repeat.delay
            )))
        }
        _pattern.positions = newPositions;
        _pattern.velocities = newVelocities;
        _pattern.timings = newTimings;
    }

    if (!precomputedBulletPattern && !patternOptions.towardsPlayer) {
        preComputedBulletPatterns[uid] = _pattern;
        preComputedBulletTextures[uid] = computeSourceTextures(_pattern, scene)
    }

    _pattern.uid = uid;
    return _pattern;
};
