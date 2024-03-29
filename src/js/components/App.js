import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';

import { vars, objectsData, customizerData, debugObject } from './data/vars';
import Time from '../utils/Time';
import UpdateMaterials from './UpdateMaterials.js';
import Lights from './Lights';
import Camera from './Camera.js'; // camera constructor
import Navigation from './Navigation';
import Sizes from './Sizes.js';
import Interface from './Interface';
import Effects from './Effects';
import Screenshot from './Screenshot';

import World from './World';

import { validateForms } from '../utils/forms';
import { isIos, setVh } from './Utils';

export default class App {
  constructor(_options) {
    this.canvas = document.querySelector(`.${vars.canvasClass}`);
    this.domContainer = document.querySelector('.main');
    this.time = new Time();
    this.sizes = new Sizes();

    this.car = {};
    this.girl = {};
    this.location = {};

    this.objects = objectsData; // Models data
    this.customizer = customizerData; // Objects sets available for each scene \ location

    this.lights = {};

    this.iosStuff();
    this.initConfig();
    this.setDebug();
    this.setLoadingManager();
    this.setRenderer();
    this.setUpdateMaterials();

    this.setCamera();
    // this.setNavigation(); // custom mouse navigation (by Bruno Simon)
    this.setHelpers();
    // this.setLights();

    this.setWorld();
    this.setEffects();
    this.setScreenshot();
    this.setInterface();

    this.setEvents();

    // validateForms();
  }

  iosStuff() {
    if (isIos()) {
      window.createImageBitmap = undefined;
    }
  }

  initConfig() {
    this.config = {
      scene: this.customizer.night,
      car: 'lamborgini',
      girl: 'empty',
      spritegirl: 'girl1',
      envMapType: 'cube',
      showCalendar: false,
      showLogoSprite: false,
      screenshotSize: { width: 1366, height: 768 },
      screenshotType: 'preview',
      clothing: 'clothing1',
      pose: 'pose1',
      carColor: vars.carColors[0][1],
    };

    // default config to load
    // todo get defaults from config

    // needed for Navigation instance
    // this.config.width = this.sizes.width;
    // this.config.height = this.sizes.height;
    // this.config.smallestSide = Math.min(this.config.width, this.config.height);
    // this.config.largestSide = Math.max(this.config.width, this.config.height);
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
      setTimeout(() => {
        this.loadingScreen.classList.remove('preloader--active');

        if (!this.debugObject.firstLoadCompleted) {
          setTimeout(() => {
            this.loadingScreen.classList.add('preloader--light');
          }, 500);
        }
      }, 500);

      // Initial Camera Movement
      if (!this.debugObject.cameraInitMovementCompleted) {
        this.camera.startCameraInitialFly();
        this.debugObject.cameraInitMovementCompleted = true;
      }

      this.debugObject.needsUpdate = true;
    };
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // console.log('Loading ' + itemsLoaded + ' of ' + itemsTotal + ' total');
      const progress = Math.ceil((itemsLoaded / itemsTotal) * 100);
      if (progress > 50) {
        document.querySelector('.preloader__text').classList.add('visible');
      }
      vars.preloaderProgressDom.innerHTML = progress + '%';
    };
    this.loadingManager.onError = (url) => {
      console.log('Error loading ' + url);
    };
  }

  setRenderer() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#333333');

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      // antialias: false,
      stencil: false,
      // depth: false,
    });
    this.renderer.setPixelRatio(this.debugObject.pixelRatio);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.autoClear = false;

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
      config: this.config,
    });
  }

  setCamera() {
    this.camera = new Camera({
      fov: 32,
      sizes: this.sizes.width / this.sizes.height,
      debug: this.debug,
      renderer: this.renderer,
      time: this.time,
    });
    this.scene.add(this.camera.instance);

    this.cameraOrtho = new THREE.OrthographicCamera(
      -this.sizes.width / 2,
      this.sizes.width / 2,
      this.sizes.height / 2,
      -this.sizes.height / 2,
      1,
      10
    );
    this.cameraOrtho.position.z = 10;
    this.sceneOrtho = new THREE.Scene();
  }

  setEffects() {
    this.effects = new Effects({
      renderer: this.renderer,
      camera: this.camera,
      cameraOrtho: this.cameraOrtho,
      scene: this.scene,
      sceneOrtho: this.sceneOrtho,
      debug: this.debug,
      sizes: this.sizes,
    });
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
    // this.scene.add(this.camera.boundaryHelper);
  }

  setModelLoadedListener(object) {
    // todo move this to Car class
    object.on('loaded', () => {
      // console.log('Car loaded event');
      this.updateMaterials.updateAllMaterials(); //todo remove if texture loads correctly
    });
  }

  render() {
    if (this.debugObject.showStats === true) {
      this.stats.begin();
    }
    // this.renderer.render(this.scene, this.camera.instance); // no effects
    this.effects.composer.render(); // with effects
    this.renderer.clearDepth();
    this.renderer.render(this.sceneOrtho, this.cameraOrtho); // no effects

    // this.renderer.toneMappingExposure = this.debugObject.exposure;
    // this.effects.composer.toneMappingExposure = this.debugObject.exposure;
    if (this.debugObject.showStats === true) {
      this.stats.end();
    }
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

    this.cameraOrtho.left = -newWidth / 2;
    this.cameraOrtho.right = newWidth / 2;
    this.cameraOrtho.top = newHeight / 2;
    this.cameraOrtho.bottom = -newHeight / 2;
    this.cameraOrtho.updateProjectionMatrix();

    if (this.debugObject.needsScreenshot === true) {
      this.world.calendar.updateHUDSprites(
        this.config.screenshotSize.width,
        this.config.screenshotSize.height
      );
      this.world.logo.updateHUDSprites(
        this.config.screenshotSize.width,
        this.config.screenshotSize.height
      );
    }

    this.renderer.setSize(newWidth, newHeight);
    this.renderer.setPixelRatio(this.debugObject.pixelRatio);
    this.effects.composer.setSize(newWidth, newHeight);
    // this.composer.setPixelRatio(this.debugObject.pixelRatio);
  }

  setEvents() {
    // Window resize
    setVh();
    this.sizes.on('resize', () => {
      this.resize();
      setVh();
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
      if (this.debugObject.needsScreenshot === true) {
        // resize canvas to screenshot size
        this.resize(
          this.config.screenshotSize.width,
          this.config.screenshotSize.height
        );

        // enable sprites
        this.world.toggleCalendar(true);
        this.world.toggleLogo(true);

        // render frame and make a screenshot
        this.render();
        this.debugObject.needsScreenshot = false;
        this.screenshot.saveAsImage();

        // disable sprites
        this.world.toggleCalendar(false);
        this.world.toggleLogo(false);

        // restore original renderer size

        this.resize();
        this.debugObject.needsUpdate = true;
      }

      // if (this.debugObject.needsToggleCalendar === true) {
      //   // todo this should not be here
      //   this.world.calendar.container.visible = this.config.showCalendar;
      //   this.debugObject.needsToggleCalendar = false;
      //   this.debugObject.needsUpdate = true;
      // }
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
      cameraOrtho: this.cameraOrtho,
      sceneOrtho: this.sceneOrtho,
      sizes: this.sizes,
    });
  }

  setInterface() {
    this.interface = new Interface({
      config: this.config,
      world: this.world,
      renderer: this.renderer,
      updateMaterials: this.updateMaterials,
      sizes: this.sizes,
      screenshot: this.screenshot,
    });
  }

  setScreenshot() {
    this.screenshot = new Screenshot({
      config: this.config,
      renderer: this.renderer,
    });
  }

  setToConfig(objectType, car) {
    this.config[objectType] = car;
  }

  // DEBUG
  setDebug() {
    this.debugObject = debugObject;
    if (this.debugObject.showDebug === true) {
      this.debug = new dat.GUI({});

      if (this.debugObject.showStats === true) {
        this.stats = new Stats();
        this.domContainer.appendChild(this.stats.dom);
      }
    }
  }
}
