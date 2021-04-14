import { isFunction } from 'lodash';
import { makeAreaPattern } from './Area';
import { makeMultiAreaPattern } from './MultiArea';
import { makeBurstPattern } from './Burst';
import { makeEmptyPattern } from './Empty';
import { makeMultiBurstPattern } from './MultiBurst';
import { makeSinglePattern } from './Single';
import { makeSprayPattern } from './Spray';
import { makeRandomConePattern } from './RandomCone';
import { Texture } from '@babylonjs/core';
import { RandVector3 } from '../../BabylonUtils';
import { makeArcPattern } from './Arc';

export const makeBulletPattern = (patternOptions, parent) => {
    let _pattern;

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
            case 'area':
                _pattern = makeAreaPattern(patternOptions, parent);
                break;
            case 'arc':
                _pattern = makeArcPattern(patternOptions, parent);
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
            case 'explicit':
                _pattern = patternOptions;
                break;
            default:
                throw new Error('Pattern type not supported: ' + patternOptions.pattern);
        }
    }

    if(patternOptions.offset){
        const offset = new RandVector3(...patternOptions.offset)
        _pattern.positions.forEach(position => position.addInPlace(offset))
    }

    if(!_pattern.timings){
        if(_pattern.positions instanceof Texture){
            throw new Error('when timings are not specified, positions must not be texture')
        }
        _pattern.timings = new Array(_pattern.positions.length); 
        for (let i = 0; i < _pattern.positions.length; ++i) 
            _pattern.timings[i] = 0;
    }

    if(patternOptions.repeat){
        const newPositions = []
        const newVelocities = []
        const newTimings = []
        for(let i = 0; i < patternOptions.repeat.times; i++){
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

    return _pattern;
};
