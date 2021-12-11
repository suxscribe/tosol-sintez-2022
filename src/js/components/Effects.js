import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// sao
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';
// ssr
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader';
import { FilmShader } from 'three/examples/jsm/shaders/FilmShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

import { debugObject } from './data/vars';

// PostProcessing
// import {
//   BloomEffect,
//   BrightnessContrastEffect,
//   BlendFunction,
//   CopyMaterial,
//   EdgeDetectionMode,
//   EffectPass,
//   EffectComposer,
//   RenderPass,
//   PredicationMode,
//   ShaderPass,
//   SMAAEffect,
//   SMAAImageLoader,
//   SMAAPreset,
//   TextureEffect,
// } from 'postprocessing';

export default class Effects {
  constructor(_options) {
    this.renderer = _options.renderer;
    this.camera = _options.camera;
    this.scene = _options.scene;
    this.debug = _options.debug;
    this.sizes = _options.sizes;

    this.debugObject = debugObject;
    // Render Target (to fix output encoding)
    // Handle Antialiasing. If browser supports WebGL2 - use multisample render target. Else - use SMAA Pass with WebglRenderTarget

    this.init();
    this.addBloom();
    // this.addVignette();
    // this.addGrain();

    this.addGammaCorrection(); // should be last

    // this.setPosprocessingEffects(); // disabled. threejs effects used instaed
    // this.addSsaaRenderPass(); // dynamic ambient occlusion. bad
    // this.addSSRPass();
  }

  init() {
    this.RenderTargetClass = null;
    if (
      this.renderer.getPixelRatio() === 1 &&
      this.renderer.capabilities.isWebGL2
    ) {
      this.RenderTargetClass = THREE.WebGLMultisampleRenderTarget;
      console.log('Using WebGLMultisapleRenderTarget');
    } else {
      this.RenderTargetClass = THREE.WebGLRenderTarget;
      console.log('Using WebGLRenderTarget');
    }
    this.renderTarget = new this.RenderTargetClass(
      this.sizes.width,
      this.sizes.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding,
      }
    );

    // Composer
    this.composer = new EffectComposer(
      this.renderer,
      this.renderTarget
      // { frameBufferType: THREE.HalfFloatType, }
    ); //
    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.composer.addPass(this.renderPass);

    // SMAA if no webgl2
    if (
      this.renderer.getPixelRatio() === 1 &&
      !this.renderer.capabilities.isWebGL2
    ) {
      console.log('Using SMAA');

      this.smaaPass = new SMAAPass();
      this.composer.addPass(this.smaaPass);

      if (this.debug) {
        this.debug.add(this.smaaPass, 'enabled').onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      }
    }

    // this.resize();
  }

  addBloom() {
    // Bloom
    this.unrealBloomPass = new UnrealBloomPass();
    this.composer.addPass(this.unrealBloomPass);
    this.unrealBloomPass.strength = 0.7;
    this.unrealBloomPass.radius = 0.1;
    this.unrealBloomPass.threshold = 0.9;

    if (this.debug) {
      this.debugUnrealBloomFolder = this.debug.addFolder(' Unreal Bloom');
      this.debugUnrealBloomFolder
        .add(this.unrealBloomPass, 'enabled')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugUnrealBloomFolder
        .add(this.unrealBloomPass, 'strength')
        .min(0)
        .max(2)
        .step(0.001)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugUnrealBloomFolder
        .add(this.unrealBloomPass, 'radius')
        .min(0)
        .max(2)
        .step(0.001)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugUnrealBloomFolder
        .add(this.unrealBloomPass, 'threshold')
        .min(0)
        .max(1)
        .step(0.001)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
    }
  }

  addVignette() {
    // Vignette
    this.effectVignettePass = new ShaderPass(VignetteShader);

    this.effectVignettePass.material.uniforms['offset'].value = 0.97;
    this.effectVignettePass.material.uniforms['darkness'].value = 1.01;

    this.effectVignettePass.renderToScreen = true;
    this.composer.addPass(this.effectVignettePass);

    if (this.debug) {
      this.debugFolderVignette = this.debug.addFolder('Vignette');
      this.debugFolderVignette
        .add(this.effectVignettePass, 'enabled')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugFolderVignette
        .add(this.effectVignettePass.material.uniforms['offset'], 'value')
        .min(0)
        .max(3)
        .step(0.01)
        .name('Offset')

        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugFolderVignette
        .add(this.effectVignettePass.material.uniforms['darkness'], 'value')
        .min(0)
        .max(3)
        .step(0.01)
        .name('Darkness')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
    }
  }

  addGrain() {
    // FILM EFFECTS
    this.effectFilmPass = new ShaderPass(FilmShader);

    this.effectFilmPass.material.uniforms['time'].value = 0;
    this.effectFilmPass.material.uniforms['nIntensity'].value = 0.2;
    this.effectFilmPass.material.uniforms['sIntensity'].value = 0;
    this.effectFilmPass.material.uniforms['sCount'].value = 0;
    this.effectFilmPass.material.uniforms['grayscale'].value = 0;

    this.effectFilmPass.renderToScreen = true;
    this.composer.addPass(this.effectFilmPass);

    if (this.debug) {
      this.debugFolderFilm = this.debug.addFolder('Film');
      this.debugFolderFilm.add(this.effectFilmPass, 'enabled').onChange(() => {
        this.debugObject.needsUpdate = true;
      });
      this.debugFolderFilm
        .add(this.effectFilmPass.material.uniforms['time'], 'value')
        .min(0)
        .max(3)
        .step(0.01)
        .name('Time')

        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugFolderFilm
        .add(this.effectFilmPass.material.uniforms['nIntensity'], 'value')
        .min(0)
        .max(1)
        .step(0.01)
        .name('nIntensity')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugFolderFilm
        .add(this.effectFilmPass.material.uniforms['sIntensity'], 'value')
        .min(0)
        .max(0.5)
        .step(0.001)
        .name('sIntensity')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugFolderFilm
        .add(this.effectFilmPass.material.uniforms['sCount'], 'value')
        .min(0)
        .max(8092)
        .step(1)
        .name('sCount')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugFolderFilm
        .add(this.effectFilmPass.material.uniforms['grayscale'], 'value')
        .min(0)
        .max(1)
        .step(1)
        .name('grayscale')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
    }
  }

  addGammaCorrection() {
    this.composer.addPass(new ShaderPass(GammaCorrectionShader)); // should be last
  }
  // DISABLED STUFF
  setPosprocessingEffects() {
    // It works. Bloom is nice. but no vignette
    // POSTPROCESSING LIBRARY PASSES
    // BLOOM
    this.effectBloom = new BloomEffect({
      luminanceThreshold: 0.75,
      luminanceSmoothing: 0.5,
      height: 480,
    });
    this.effectBloomPass = new EffectPass(
      this.camera.instance,
      this.effectBloom
    );
    this.composer.addPass(this.effectBloomPass);

    if (this.debug) {
      this.debugEffectBloomFolder = this.debug.addFolder('Bloom');
      this.debugEffectBloomFolder
        .add(this.effectBloom, 'intensity', 0.0, 3.0, 0.01)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugEffectBloomFolder
        .add(this.effectBloom.luminanceMaterial, 'threshold', 0.0, 1.0, 0.001)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugEffectBloomFolder
        .add(this.effectBloom.luminanceMaterial, 'smoothing', 0.0, 1.0, 0.001)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
    }

    // BRIGHTNESS CONTRAST
    this.effectBrightness = new BrightnessContrastEffect({
      brightness: 0,
      contranst: 0,
    });
    this.effectBrightnessPass = new EffectPass(
      this.camera.instance,
      this.effectBrightness
    );
    this.composer.addPass(this.effectBrightnessPass);

    if (this.debug) {
      this.debugEffectBrightnessFolder = this.debug.addFolder('Brightness');
      this.debugEffectBrightnessFolder
        .add(
          this.effectBrightness.uniforms.get('brightness'),
          'value',
          -0.5,
          0.5,
          0.001
        )
        .name('brightness')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugEffectBrightnessFolder
        .add(
          this.effectBrightness.uniforms.get('contrast'),
          'value',
          -0.5,
          0.5,
          0.001
        )
        .name('contrast')
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugEffectBrightnessFolder
        .add(this.effectBrightness.blendMode.opacity, 'value', 0.0, 1, 0.01)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
    }

    // SMAA
    this.assetsSMAA = {};
    // this.assetsSMAA.search = new Image();
    this.edgesTextureEffect = null;
    this.weightsTextureEffect = null;

    this.smaaImageLoader = new SMAAImageLoader(this.loadingManager);

    this.anisotropy = Math.min(
      this.composer.getRenderer().capabilities.getMaxAnisotropy(),
      8
    );

    this.smaaImageLoader.load(([search, area]) => {
      this.assetsSMAA.search = search;
      this.assetsSMAA.area = area;
    });
    console.log(this.assetsSMAA);

    this.effectSMAA = new SMAAEffect(
      this.assetsSMAA.search,
      this.assetsSMAA.area,
      SMAAPreset.HIGHT,
      EdgeDetectionMode.COLOR
    );

    this.effectSMAA.edgeDetectionMaterial.setEdgeDetectionThreshold(0.02);
    this.effectSMAA.edgeDetectionMaterial.setPredicationMode(
      PredicationMode.DEPTH
    );
    this.effectSMAA.edgeDetectionMaterial.setPredicationThreshold(0.002);
    this.effectSMAA.edgeDetectionMaterial.setPredicationScale(1.0);

    this.edgesTextureEffect = new TextureEffect({
      blendFunction: BlendFunction.SKIP,
      texture: this.effectSMAA.renderTargetEdges.texture,
    });

    this.weightsTextureEffect = new TextureEffect({
      blendFunction: BlendFunction.SKIP,
      texture: this.effectSMAA.renderTargetWeights.texture,
    });

    this.copyPass = new ShaderPass(new CopyMaterial());

    this.effectSMAAPass = new EffectPass(
      this.camera.instance,
      this.effectSMAA,
      this.edgesTextureEffect,
      this.weightsTextureEffect
    );

    this.copyPass.enabled = false;
    this.copyPass.renderToScreen = true;
    this.effectSMAAPass.renderToScreen = true;

    this.composer.addPass(this.copyPass);
    this.composer.addPass(this.effectSMAAPass);

    // debug
    if (this.debug) {
      const edgeDetectionMaterial = this.effectSMAA.edgeDetectionMaterial;

      const context = this.renderer.getContext();
      const AAMode = {
        DISABLED: 0,
        SMAA: 1,
      };

      if (this.renderer.capabilities.isWebGL2) {
        Object.assign(AAMode, { MSAA: 2 });
      }

      const SMAAMode = {
        DEFAULT: 0,
        SMAA_EDGES: 1,
        SMAA_WEIGHTS: 2,
      };

      const params = {
        antialiasing: AAMode.SMAA,
        smaa: {
          mode: SMAAMode.DEFAULT,
          preset: SMAAPreset.HIGH,
          opacity: this.effectSMAA.blendMode.opacity.value,
          'blend mode': this.effectSMAA.blendMode.blendFunction,
        },
        edgeDetection: {
          mode: Number(edgeDetectionMaterial.defines.EDGE_DETECTION_MODE),
          'contrast factor': Number(
            edgeDetectionMaterial.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR
          ),
          threshold: Number(edgeDetectionMaterial.defines.EDGE_THRESHOLD),
        },
        predication: {
          mode: Number(edgeDetectionMaterial.defines.PREDICATION_MODE),
          threshold: Number(
            edgeDetectionMaterial.defines.PREDICATION_THRESHOLD
          ),
          strength: Number(edgeDetectionMaterial.defines.PREDICATION_STRENGTH),
          scale: Number(edgeDetectionMaterial.defines.PREDICATION_SCALE),
        },
      };

      this.debugSMAAFolder = this.debug.addFolder('SMAA');

      this.debugSMAAFolder
        .add(params, 'antialiasing', AAMode)
        .onChange((value) => {
          const mode = Number(value);
          // this.effectSMAAPass.enabled = mode === AAMode.SMAA;
          this.effectSMAAPass.setEnabled(mode === AAMode.SMAA);
          console.log(this.effectSMAAPass.enabled);

          this.copyPass.enabled = !this.effectSMAAPass.isEnabled();
          this.composer.multisampling =
            mode !== AAMode.MSAA
              ? 0
              : Math.min(4, context.getParameter(context.MAX_SAMPLES));
          console.log(this.copyPass.enabled);
          console.log(this.composer.multisampling);

          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.smaa, 'mode', SMAAMode)
        .onChange((value) => {
          const mode = Number(value);
          this.edgesTextureEffect.blendMode.setBlendFunction(
            mode === SMAAMode.SMAA_EDGES
              ? BlendFunction.NORMAL
              : BlendFunction.SKIP
          );

          this.weightsTextureEffect.blendMode.setBlendFunction(
            mode === SMAAMode.SMAA_WEIGHTS
              ? BlendFunction.NORMAL
              : BlendFunction.SKIP
          );

          this.effectSMAAPass.encodeOutput =
            mode !== SMAAMode.SMAA_EDGES && mode !== SMAAMode.SMAA_WEIGHTS;

          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.smaa, 'preset', SMAAPreset)
        .onChange((value) => {
          this.effectSMAA.applyPreset(Number(value));
          edgeDetectionMaterial.setEdgeDetectionThreshold(
            params.edgeDetection.threshold
          );
          this.debugObject.needsUpdate = true;
        });
      //
      this.debugSMAAFolder
        .add(params.edgeDetection, 'mode', EdgeDetectionMode)
        .onChange((value) => {
          edgeDetectionMaterial.setEdgeDetectionMode(Number(value));
          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.edgeDetection, 'contrast factor', 1.0, 3.0, 0.01)
        .onChange((value) => {
          edgeDetectionMaterial.setLocalContrastAdaptationFactor(Number(value));
          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.edgeDetection, 'threshold', 0.0, 0.5, 0.0001)
        .onChange((value) => {
          edgeDetectionMaterial.setEdgeDetectionThreshold(Number(value));
          this.debugObject.needsUpdate = true;
        });
      //
      this.debugSMAAFolder
        .add(params.predication, 'mode', PredicationMode)
        .onChange((value) => {
          edgeDetectionMaterial.setPredicationMode(Number(value));
          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.predication, 'threshold', 0.0, 0.5, 0.0001)
        .onChange((value) => {
          edgeDetectionMaterial.setPredicationThreshold(Number(value));
          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.predication, 'strength', 0.0, 1.0, 0.0001)
        .onChange((value) => {
          edgeDetectionMaterial.setPredicationStrength(Number(value));
          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.predication, 'scale', 1.0, 5.0, 0.01)
        .onChange((value) => {
          edgeDetectionMaterial.setPredicationScale(Number(value));
          this.debugObject.needsUpdate = true;
        });
      this.debugSMAAFolder
        .add(params.smaa, 'opacity', 0.0, 1.0, 0.01)
        .onChange((value) => {
          this.effectSMAA.blendMode.opacity.value = value;
          this.debugObject.needsUpdate = true;
        });

      this.debugSMAAFolder
        .add(params.smaa, 'blend mode', BlendFunction)
        .onChange((value) => {
          this.effectSMAA.blendMode.setBlendFunction(Number(value));
          this.debugObject.needsUpdate = true;
        });
    }
  }

  addSSRPass() {
    // SSR
    // Ground

    this.ssrPlane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(16, 16),
      new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
    );
    this.ssrPlane.rotation.x = -Math.PI / 2;
    this.ssrPlane.position.y = -0.001;
    // this.ssrPlane.receiveShadow = true;
    // this.scene.add(this.ssrPlane);

    this.ssrGeometry = new THREE.PlaneBufferGeometry(16, 16);
    this.groundReflector = new ReflectorForSSRPass(this.ssrGeometry, {
      clipBias: 0.0003,
      textureWidth: window.innerWidth,
      textureHeight: window.innerHeight,
      color: 0x888888,
      useDepthTexture: true,
    });
    this.groundReflector.material.depthWrite = false;
    this.groundReflector.rotation.x = -Math.PI / 2;
    this.groundReflector.visible = false;
    this.scene.add(this.groundReflector);

    this.ssrPass = new SSRPass({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera.instance,
      width: innerWidth,
      height: innerHeight,
      groundReflector: this.groundReflector,
      selects: this.debugObject.selects,
    });
    this.ssrPass.thickness = 0.018;
    this.ssrPass.maxDistance = 1;
    this.ssrPass.blur = false;

    this.groundReflector.maxDistance = this.ssrPass.maxDistance;

    this.composer.addPass(this.ssrPass);

    if (this.debug) {
      this.debugSsrPass = this.debug.addFolder('SSR Pass');
      this.debugSsrPass
        .add(this.ssrPass, 'thickness')
        .min(0)
        .max(0.1)
        .step(0.0001)
        .onChange(() => {
          this.debugObject.needsUpdate = true;
        });
      this.debugSsrPass
        .add(this.ssrPass, 'maxDistance')
        .min(0)
        .max(3)
        .step(0.01)
        .onChange(() => {
          this.groundReflector.maxDistance = this.ssrPass.maxDistance;
          this.debugObject.needsUpdate = true;
        });
      this.debugSsrPass.add(this.ssrPass, 'blur').onChange(() => {
        this.debugObject.needsUpdate = true;
      });
    }
  }

  addSsaaRenderPass() {
    // SSAA
    this.ssaaRenderPass = new SSAARenderPass(
      this.scene,
      this.camera.instance,
      0xaaaaaa,
      0
    );
    this.composer.addPass(this.ssaaRenderPass);
    // Ambient Occlusion
    this.saoPass = new SAOPass(this.scene, this.camera.instance, false, true);
    this.composer.addPass(this.saoPass);
    this.saoPass.resolution.set(4096, 4096);
    this.saoPass.params.saoBias = 0.58;
    this.saoPass.params.saoIntensity = 0.0001;
    this.saoPass.params.saoScale = 0.5;
    this.saoPass.params.saoBias = 0.58;
    this.saoPass.params.saoKernelRadius = 80;
    if (this.debug) {
      this.debug
        .add(this.saoPass.params, 'output', {
          Beauty: SAOPass.OUTPUT.Beauty,
          'Beauty+SAO': SAOPass.OUTPUT.Default,
          SAO: SAOPass.OUTPUT.SAO,
          Depth: SAOPass.OUTPUT.Depth,
          Normal: SAOPass.OUTPUT.Normal,
        })
        .onChange((value) => {
          this.saoPass.params.output = parseInt(value);
        });
      this.debug.add(this.saoPass.params, 'saoBias', -1, 1);
      this.debug.add(this.saoPass.params, 'saoIntensity', 0, 1, 0.0001);
      this.debug.add(this.saoPass.params, 'saoScale', 0, 10);
      this.debug.add(this.saoPass.params, 'saoKernelRadius', 1, 100);
      this.debug.add(this.saoPass.params, 'saoMinResolution', 0, 1);
      this.debug.add(this.saoPass.params, 'saoBlur');
      this.debug.add(this.saoPass.params, 'saoBlurRadius', 0, 200);
      this.debug.add(this.saoPass.params, 'saoBlurStdDev', 0.5, 150);
      this.debug.add(this.saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1);
    }
  }
}
