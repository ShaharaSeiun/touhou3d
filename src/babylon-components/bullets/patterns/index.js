import { isFunction } from 'lodash';
import { makeAreaPattern } from './Area';
import { makeBurstPattern } from './Burst';
import { makeEmptyPattern } from './Empty';
import { makeMultiBurstPattern } from './MultiBurst';
import { makeSinglePattern } from './Single';
import { makeSprayPattern } from './Spray';

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
            case 'spray':
                _pattern = makeSprayPattern(patternOptions, parent);
                break;
            default:
                throw new Error('Pattern type not supported: ' + patternOptions.pattern);
        }
    }

    if(!_pattern.timings){
        _pattern.timings = new Array(_pattern.positions.length); 
        for (let i = 0; i < _pattern.positions.length; ++i) 
            _pattern.timings[i] = 0;
    }

    if(patternOptions.repeat){
        for(let i = 1; i < patternOptions.repeat.times; i++){
            _pattern.positions.push(..._pattern.positions)
            _pattern.velocities.push(..._pattern.velocities)
            _pattern.timings.push(..._pattern.timings.map(timing => (
                timing + i * patternOptions.repeat.delay
            )))
        }
    }

    return _pattern;
};
