import { glsl } from '../../BabylonUtils';
import { collisionSnippet, mainHeaderSnippet, postComputeSnippet, uniformSnippet } from './Common';
import { EnemyBulletBehaviour } from './EnemyBulletBehaviour';

export const linearBehaviourPositionPixelShader = glsl`
    ${uniformSnippet}

    void main()	{
        ${mainHeaderSnippet}

        vec4 out_Position = vec4( position + (velocity * delta), 1.);

        ${collisionSnippet}
        ${postComputeSnippet}
        
        gl_FragColor = out_Position;
    }
`;

export const linearBehaviourVelocityPixelShader = glsl`
${uniformSnippet}

    void main() {

        ${mainHeaderSnippet}

        ${postComputeSnippet}
        vec4 out_Velocity = vec4( velocity, 1.);

        gl_FragColor = out_Velocity;
    }
`;

class LinearBehaviour extends EnemyBulletBehaviour {
    constructor(environmentCollision, radius, parent) {
        super('linearBehaviourPosition', 'linearBehaviourVelocity', parent, environmentCollision, null, radius);
    }
}

export const makeLinearBehaviour = (environmentCollision, radius, parent) => {
    return new LinearBehaviour(environmentCollision, radius, parent);
};
