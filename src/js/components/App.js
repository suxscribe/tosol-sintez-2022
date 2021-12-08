import * as THREE from 'three';
import * as dat from 'dat.gui';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// sao
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';
// ssr
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import {
  BloomEffect,
  BrightnessContrastEffect,
  EffectPass,
  EffectComposer,
  RenderPass,
} from 'postprocessing';

import { isEmptyObject } from './Utils';
import { vars, objectsData, customizerData, debugObject } from './data/vars';
import Time from '../utils/Time';
import UpdateMaterials from './UpdateMaterials.js';
import Lights from './Lights';
import Camera from './Camera.js'; // camera constructor
import Navigation from './Navigation';
import Sizes from './Sizes.js';
import Interface from './Interface';

import Car from './Car.js';
import World from './World';

import { validateForms } from '../utils/forms';

export default class App {
  constructor(_options) {
    this.canvas = document.querySelector(`.${vars.canvasClass}`);
    this.time = new Time();
    this.sizes = new Sizes();

    this.car = {};
    this.girl = {};
    this.location = {};

    this.objects = objectsData; // Models data
    this.customizer = customizerData; // Objects sets available for each scene \ location

    this.lights = {};

    this.initConfig();
    this.setDebug();
    this.setLoadingManager();
    this.setRenderer();
    this.setUpdateMaterials();

    this.setCamera();
    // this.setNavigation(); // custom mouse navigation (by Bruno Simon)
    this.setHelpers();
    this.setLights();

    this.setWorld();
    this.setEffects();

    // this.renderCustomizer();
    this.setInterface();

    this.setEvents();

    validateForms();
  }

  initConfig() {
    this.config = {};

    // default config to load
    // todo get defaults from config
    this.config.scene = this.customizer.desert;
    this.config.car = 'lamborgini';
    this.config.girl = 'empty';
    this.config.spritegirl = 'girl1';
    this.config.envMapType = 'cube';
    this.config.showCalendar = false;
    this.config.screenshotSize = { width: 1920, height: 1080 };
    this.config.clothing = 'clothing1';
    this.config.pose = 'pose1';

    // needed for Navigation instance
    this.config.width = this.sizes.width;
    this.config.height = this.sizes.height;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);
  }

  setLoadingManager() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingScreen = document.querySelector('.preloader');

    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      this.loadingScreen.classList.add('preloader--active');
    };

    this.loadingManager.onLoad = () => {
      console.log('load complete');
      this.updateMaterials.updateAllMaterials(); // update materials after everything was loaded

      if (this.pmremGenerator) {
        // exr loader part
        this.pmremGenerator.dispose();
      }

      // hide loading screen
      this.loadingScreen.classList.remove('preloader--active');

      // Initial Camera Movement
      if (!this.debugObject.cameraInitMovementCompleted) {
        this.camera.startCameraInitialFly();
        this.debugObject.cameraInitMovementCompleted = true;
      }
      this.debugObject.needsUpdate = true;
    };
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // console.log('Loading ' + itemsLoaded + ' of ' + itemsTotal + ' total');
    };
    this.loadingManager.onError = (url) => {
      console.log('Error loading ' + url);
    };
  }

  setRenderer() {
    // Scene
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color('#eeeeee');

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: false,
    });
    this.renderer.setPixelRatio(this.debugObject.pixelRatio);
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.renderer.physicallyCorrectLights = false; // true makes everything a bit darker
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  setUpdateMaterials() {
    this.updateMaterials = new UpdateMaterials({
      scene: this.scene,
      loadingManager: this.loadingManager,
    });
  }

  setCamera() {
    this.camera = new Camera({
      fov: 36,
      sizes: this.sizes.width / this.sizes.height,
      debug: this.debug,
      renderer: this.renderer,
      time: this.time,
    });
    this.scene.add(this.camera.instance);
  }

  setEffects() {
    // Render Target (to fix output encoding)
    this.renderTarget = new THREE.WebGLRenderTarget(
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
    this.composer = new EffectComposer(this.renderer, this.renderTarget);
    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.composer.addPass(this.renderPass);

    // PASSES
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

    // this.addSsaaRenderPass(); // dynamic ambient occlusion. bad
    // this.addSSRPass();

    this.resize();
    // this.composer.addPass(new ShaderPass(GammaCorrectionShader)); // should be last
  }

  setNavigation() {
    this.navigation = new Navigation({
      camera: this.camera,
      time: this.time,
      config: this.config,
      canvas: this.canvas,
    });

    this.time.on('tick', () => {
      this.navigation.update();
    });
  }

  setLights() {
    // Ligting
    this.lights = new Lights({
      scene: this.scene,
      debug: this.debug,
      camera: this.camera,
    });
  }

  setHelpers() {
    // axes helper
    // this.axesHelper = new THREE.AxesHelper(10);
    // this.scene.add(this.axesHelper);
    this.scene.add(this.camera.boundaryHelper);
  }

  setModelLoadedListener(object) {
    // todo move this to Car class
    object.on('loaded', () => {
      // console.log('Car loaded event');
      this.updateMaterials.updateAllMaterials(); //todo remove if texture loads correctly
    });
  }

  render() {
    // this.renderer.render(this.scene, this.camera.instance); // no effects
    this.composer.render(); // with effects
    this.renderer.toneMappingExposure = this.debugObject.exposure;
    this.composer.toneMappingExposure = this.debugObject.exposure;
  }

  resize(width = null, height = null) {
    let newWidth;
    let newHeight;

    if (width && height) {
      newWidth = width;
      newHeight = height;
    } else {
      newWidth = this.sizes.width;
      newHeight = this.sizes.height;
    }

    this.camera.instance.aspect = newWidth / newHeight;
    this.camera.instance.updateProjectionMatrix();

    this.renderer.setSize(newWidth, newHeight);
    this.renderer.setPixelRatio(this.debugObject.pixelRatio);
    this.composer.setSize(newWidth, newHeight);
    // this.composer.setPixelRatio(this.debugObject.pixelRatio);
  }

  setEvents() {
    // Window resize
    this.sizes.on('resize', () => {
      this.resize();
      // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.debugObject.needsUpdate = true;
    });

    // Update Animation
    this.time.on('tick', () => {
      // render on demand
      if (this.debugObject.needsUpdate === true) {
        this.render();
        this.debugObject.needsUpdate = false;
      }

      // Screenshot stuff
      if (this.debugObject.needsScreenshot) {
        this.resize(
          this.config.screenshotSize.width,
          this.config.screenshotSize.height
        );

        this.render();
        this.debugObject.needsScreenshot = false;
        this.interface.saveAsImage();

        // restore original renderer size
        this.resize();

        this.debugObject.needsUpdate = true;
      }

      if (this.debugObject.needsToggleCalendar === true) {
        this.world.calendar.container.visible = this.config.showCalendar;
        this.debugObject.needsToggleCalendar = false;
        this.debugObject.needsUpdate = true;
      }
    });

    this.camera.on('cameraupdate', () => {
      this.debugObject.needsUpdate = true;
    });
    this.camera.on('cameratransitionend', () => {
      this.debugObject.needsUpdate = false;
    });
  }

  ////////////

  setWorld() {
    this.world = new World({
      objects: this.objects,
      config: this.config,
      car: this.car,
      girl: this.girl,
      location: this.location,
      customizer: this.customizer,
      renderer: this.renderer,
      scene: this.scene,
      updateMaterials: this.updateMaterials,
      debug: this.debug,
      loadingManager: this.loadingManager,
      camera: this.camera,
      sizes: this.sizes,
    });
  }

  setInterface() {
    this.interface = new Interface({
      config: this.config,
      world: this.world,
      renderer: this.renderer,
      updateMaterials: this.updateMaterials,
    });
  }

  setToConfig(objectType, car) {
    this.config[objectType] = car;
  }

  // DEBUG
  setDebug() {
    this.debug = new dat.GUI({});
    this.debugObject = debugObject;
  }

  addSSRPass() {
    // SSR
    // Ground

    this.ssrPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
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
