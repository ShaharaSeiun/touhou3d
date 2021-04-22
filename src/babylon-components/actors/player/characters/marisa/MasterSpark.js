import { Animation, Color3, Vector3, Effect, MeshBuilder, ShaderMaterial, Matrix } from '@babylonjs/core'
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { glsl } from '../../../../BabylonUtils'
import { AnimationContext, GlowContext } from '../../../../gameLogic/GeneralContainer'
import { useDoSequence } from '../../../../hooks/useDoSequence'
import { useName } from '../../../../hooks/useName'
import { useTexture } from '../../../../hooks/useTexture'

Effect.ShadersStore['masterSparkVertexShader'] = glsl`
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 world;
  uniform mat4 worldViewProjection;
  varying vec3 vPositionW;
  varying vec3 vPosition;
  varying vec3 vNormalW;

  //World normal
  #include<helperFunctions>

  //Entry point
  void main(void) {

      //World normal
      vNormalW = normal;

      vPosition = position;
      //WorldPos
      vec4 positionW = world * vec4(position, 1.0);
      vPositionW = positionW.xyz;

      //VertexOutput
      gl_Position = worldViewProjection * vec4(position, 1.0);

  }
`;

Effect.ShadersStore['masterSparkFragmentShader'] = glsl`
    varying vec3 vPositionW;
    varying vec3 vPosition;
    varying vec3 vNormalW;
    uniform vec3 cameraPosition;
    vec3 hsl2rgb( in vec3 c )
    {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
    vec3 rgb2hsl( in vec3 c ){
        float h = 0.0;
        float s = 0.0;
        float l = 0.0;
        float r = c.r;
        float g = c.g;
        float b = c.b;
        float cMin = min( r, min( g, b ) );
        float cMax = max( r, max( g, b ) );
    
        l = ( cMax + cMin ) / 2.0;
        if ( cMax > cMin ) {
        float cDelta = cMax - cMin;
            
        s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );
            
        if ( r == cMax ) {
            h = ( g - b ) / cDelta;
        } else if ( g == cMax ) {
            h = 2.0 + ( b - r ) / cDelta;
        } else {
            h = 4.0 + ( r - g ) / cDelta;
        }
    
        if ( h < 0.0) {
            h += 6.0;
        }
        h = h / 6.0;
        }
        return vec3( h, s, l );
    }
    void main() {
        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        float fresnelTerm = dot(viewDirectionW, vNormalW);
        fresnelTerm = clamp(1. - fresnelTerm, 0., 0.5);
        fresnelTerm = pow(fresnelTerm, 0.5);
        vec4 from = vec4(1., 1., 1., 1.);
        vec4 to = vec4(vPosition, 0.);
        vec4 color = mix(from, to, fresnelTerm);
        vec3 hsl = rgb2hsl(abs(color.xyz));
        hsl.z = max(hsl.z, 0.5);
        vec3 rgb = hsl2rgb(hsl);
        float a = 1. - fresnelTerm;
        gl_FragColor = vec4(rgb, a);
    }
`;

export const MasterSpark = (props) => {
    const name = useName()
    const runeEmpty = useTexture("runeEmpty")
    const circle1Ref = useRef()
    const circle2Ref = useRef()
    const circle3Ref = useRef()
    const circle4Ref = useRef()
    const transformNodeRef = useRef();
    const scene = useScene()
    const { registerAnimation } = useContext(AnimationContext)
    const glowLayer = useContext(GlowContext);

    useEffect(() => {
        const x1 = 1;
        const x2 = 3;
        const x3 = 6;
        const x4 = 10;

        const y = (x) => {
            return Math.pow(x, 0.8);
        }

        circle1Ref.current.position = new Vector3(0, 0, x1)
        const y1 = y(x1);
        circle1Ref.current.targetScaling = new Vector3(y1, y1, y1).scale(1.6);

        circle2Ref.current.position = new Vector3(0, 0, x2)
        const y2 = y(x2);
        circle2Ref.current.targetScaling = new Vector3(y2, y2, y2).scale(1.6);

        circle3Ref.current.position = new Vector3(0, 0, x3)
        const y3 = y(x3);
        circle3Ref.current.targetScaling = new Vector3(y3, y3, y3).scale(1.6);

        circle4Ref.current.position = new Vector3(0, 0, x4)
        const y4 = y(x4);
        circle4Ref.current.targetScaling = new Vector3(y4, y4, y4).scale(1.6);

        const masterSparkZScale = 30;

        const myShape = [];
        const segments = 80;
        const length = 1;

        for (let i = 0; i <= segments; i++) {
            myShape.push(new Vector3(y(masterSparkZScale * i * length / segments), i * length / segments, 0))
        }

        // const mesh = MeshBuilder.CreateLathe(
        //     "masterSpark",
        //     {
        //         shape: myShape,
        //         tessellation: segments / 2
        //     }
        // );

        const mesh = MeshBuilder.CreateSphere("sphere", {})
        mesh.position = new Vector3(0, 0, 5);
        mesh.scaling = new Vector3(1, 1, 10);

        const material = new ShaderMaterial(
            'masterSpark',
            scene,
            {
                vertex: 'masterSpark',
                fragment: 'masterSpark',
            },
            {
                attributes: ['position', 'normal', 'uv'],
                uniforms: ['worldView', 'worldViewProjection', 'view', 'projection', 'direction', 'cameraPosition', 'world'],
                needAlphaBlending: true
            }
        );

        mesh.material = material;
        mesh.parent = transformNodeRef.current;

        // Animation.CreateAndStartAnimation(
        //     name + "spinanim",
        //     mesh,
        //     'rotation',
        //     2,
        //     1,
        //     new Vector3(0, 0, 0),
        //     new Vector3(0, 0, Math.PI * 2),
        //     Animation.ANIMATIONLOOPMODE_CYCLE,
        // )

        glowLayer.addIncludedOnlyMesh(circle1Ref.current)
        glowLayer.addIncludedOnlyMesh(circle2Ref.current)
        glowLayer.addIncludedOnlyMesh(circle3Ref.current)
        glowLayer.addIncludedOnlyMesh(circle4Ref.current)
        // glowLayer.referenceMeshToUseItsOwnMaterial(mesh);
    }, [glowLayer, name, scene])

    const invulnerableTimings = useMemo(() => [0, 1, 2, 3, 4], []);
    const invulnerableActions = useMemo(() => [
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle1Ref.current,
                    "scaling",
                    1,
                    1,
                    circle1Ref.current.scaling,
                    circle1Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
        },
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle2Ref.current,
                    "scaling",
                    1,
                    1,
                    circle2Ref.current.scaling,
                    circle2Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
        },
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle3Ref.current,
                    "scaling",
                    1,
                    1,
                    circle3Ref.current.scaling,
                    circle3Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
        },
        () => {
            registerAnimation(
                Animation.CreateAndStartAnimation(
                    name + "anim",
                    circle4Ref.current,
                    "scaling",
                    1,
                    1,
                    circle4Ref.current.scaling,
                    circle4Ref.current.targetScaling,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                )
            )
        }
    ], [name, registerAnimation]);
    useDoSequence(true, circle1Ref, invulnerableTimings, invulnerableActions);

    return (
        <transformNode ref={transformNodeRef} {...props}>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(100, 100, 100)}
                ref={circle1Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(1, 0, 0)} name={name + 'circle1Mat'} />
            </plane>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(100, 100, 100)}
                ref={circle2Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(1, 1, 0)} name={name + 'circle2Mat'} />
            </plane>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(100, 100, 100)}
                ref={circle3Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(0, 0, 1)} name={name + 'circle3Mat'} />
            </plane>
            <plane
                name={name + 'plane'}
                scaling={new Vector3(100, 100, 100)}
                ref={circle4Ref}
            >
                <standardMaterial useAlphaFromDiffuseTexture disableLighting={true} diffuseTexture={runeEmpty} emissiveColor={new Color3(0, 1, 0)} name={name + 'circle4Mat'} />
            </plane>
        </transformNode>
    )
}
