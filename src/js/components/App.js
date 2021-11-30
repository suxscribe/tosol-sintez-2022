import * as THREE from 'three';
import * as dat from 'dat.gui';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';

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

export default class App {
  constructor(_options) {
    this.canvas = document.querySelector('.webgl');
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
    this.setEffects();
    // this.setNavigation(); // custom mouse navigation (by Bruno Simon)
    this.setHelpers();
    this.setLights();

    this.setWorld();

    // this.renderCustomizer();
    this.setInterface();

    this.setEvents();
  }

  initConfig() {
    this.config = {};

    // default config to load
    // todo get defaults from config
    this.config.scene = this.customizer.desert;
    this.config.car = 'porsche';
    this.config.girl = 'girl1';
    this.config.envMapType = 'cube';

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
      console.log(
        'Started loading ' +
          url +
          '. Loaded ' +
          itemsLoaded +
          ' of ' +
          itemsTotal +
          ' total'
      );
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

      this.camera.startCameraInitialFly();
    };
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log('Loading ' + itemsLoaded + ' of ' + itemsTotal + ' total');
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
      // preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(
      Math.min(Math.max(window.devicePixelRatio, 2), 2)
    );
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    this.scene.add(this.camera.boundaryHelper);

    // this.camera.instance.position.set(2, 4, 26);
    // this.camera.setOrbitControls(); // not using orbit controls since using custom Navigation

    // this.camera.instance.lookAt(20, 10, 5); // not working with controls enabled
  }

  setEffects() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.composer.addPass(this.renderPass);

    // // SSAA
    // this.ssaaRenderPass = new SSAARenderPass(
    //   this.scene,
    //   this.camera.instance,
    //   0xaaaaaa,
    //   0
    // );
    // this.composer.addPass(this.ssaaRenderPass);

    // // Ambient Occlusion
    // this.saoPass = new SAOPass(this.scene, this.camera.instance, false, true);
    // this.composer.addPass(this.saoPass);

    // this.saoPass.resolution.set(4096, 4096);
    // this.saoPass.params.saoBias = 0.58;
    // this.saoPass.params.saoIntensity = 0.0001;
    // this.saoPass.params.saoScale = 0.5;
    // this.saoPass.params.saoBias = 0.58;
    // this.saoPass.params.saoKernelRadius = 80;

    // if (this.debug) {
    //   this.debug
    //     .add(this.saoPass.params, 'output', {
    //       Beauty: SAOPass.OUTPUT.Beauty,
    //       'Beauty+SAO': SAOPass.OUTPUT.Default,
    //       SAO: SAOPass.OUTPUT.SAO,
    //       Depth: SAOPass.OUTPUT.Depth,
    //       Normal: SAOPass.OUTPUT.Normal,
    //     })
    //     .onChange((value) => {
    //       this.saoPass.params.output = parseInt(value);
    //     });
    //   this.debug.add(this.saoPass.params, 'saoBias', -1, 1);
    //   this.debug.add(this.saoPass.params, 'saoIntensity', 0, 1, 0.0001);
    //   this.debug.add(this.saoPass.params, 'saoScale', 0, 10);
    //   this.debug.add(this.saoPass.params, 'saoKernelRadius', 1, 100);
    //   this.debug.add(this.saoPass.params, 'saoMinResolution', 0, 1);
    //   this.debug.add(this.saoPass.params, 'saoBlur');
    //   this.debug.add(this.saoPass.params, 'saoBlurRadius', 0, 200);
    //   this.debug.add(this.saoPass.params, 'saoBlurStdDev', 0.5, 150);
    //   this.debug.add(this.saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1);
    // }
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
    this.axesHelper = new THREE.AxesHelper(10);
    this.scene.add(this.axesHelper);
  }

  setModelLoadedListener(object) {
    object.on('loaded', () => {
      // console.log('Car loaded event');
      this.updateMaterials.updateAllMaterials(); //todo remove if texture loads correctly
    });
  }

  setEvents() {
    // Window resize
    this.sizes.on('resize', () => {
      this.camera.instance.aspect = this.sizes.width / this.sizes.height;
      this.camera.instance.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
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
        this.renderer.setSize(2000, 1500); // resize renderer to desired size
        this.render();
        this.debugObject.needsScreenshot = false;
        this.interface.saveAsImage();
        this.renderer.setSize(this.sizes.width, this.sizes.height); // renderer original size
        this.debugObject.needsUpdate = true;
      }
    });

    this.camera.on('cameraupdate', () => {
      // this.render();
      this.debugObject.needsUpdate = true;
    });
    this.camera.on('cameratransitionend', () => {
      this.debugObject.needsUpdate = false;
    });
  }

  render() {
    // this.renderer.render(this.scene, this.camera.instance); // no effects
    this.composer.render(); // with effects
    this.renderer.toneMappingExposure = this.debugObject.exposure;
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

    this.debug.add(this.debugObject, 'removeCar').name('Remove Car');
    this.debug.add(this.debugObject, 'reloadCar').name('Reload Car');

    this.debug
      .add(this.config, 'car', {
        hummer: 'hummer',
        cruiser: 'cruiser',
        delorean: 'delorean',
        porsche: 'porsche',
      })
      .name('Config Car')
      .onChange(() => {
        this.world.reloadCar();
      });
    // this.debug.add(this.config, 'girl').name('Config Girl');
  }
}
