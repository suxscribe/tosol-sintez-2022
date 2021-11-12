import * as THREE from 'three';
import * as dat from 'dat.gui';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { isEmptyObject } from './Utils';
import { vars } from './data/vars';
import Time from '../utils/Time';
import UpdateMaterials from './UpdateMaterials.js';
import Lights from './Lights';
import Camera from './Camera.js'; // camera constructor
import Navigation from './Navigation';
import Sizes from './Sizes.js';

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

    this.objects = {
      locations: {
        desert: {
          name: 'Desert',
          source: '/assets/models/desert.glb',
          position: new THREE.Vector3(-15, -1.7, -9),
          scale: new THREE.Vector3(0.25, 0.25, 0.25),
          rotation: new THREE.Euler(0, Math.PI * 0.66, 0),
        },
        track: {
          name: 'Track',
          source: '/assets/models/desert.glb',
          position: new THREE.Vector3(-15, -1.7, -9),
          scale: new THREE.Vector3(0.25, 0.25, 0.25),
          rotation: new THREE.Euler(0, Math.PI * 0.66, 0),
        },
      },
      cars: {
        hummer: {
          name: 'Hummer',
          source: '/assets/models/hummerhx4.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(0.08, 0.08, 0.08),
          rotation: new THREE.Euler(0, Math.PI * -0.5, 0),
        },
        cruiser: {
          name: 'Land Cruiser',
          source: '/assets/models/landcruiser/landcruiser.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(2, 2, 2),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
        delorean: {
          name: 'DeLorean',
          source: '/assets/models/delorean.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(2.5, 2.5, 2.5),
          rotation: new THREE.Euler(0, 0, 0),
        },
        porsche: {
          name: 'Porsche',
          source: '/assets/models/porsche/porsche.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(3.5, 3.5, 3.5),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
      },
      girls: {
        girl1: {
          name: 'Girl 1',
          source: '/assets/models/girl1.glb',
          position: new THREE.Vector3(5, 0, 6),
          scale: new THREE.Vector3(1, 1, 1),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
        girl2: {
          name: 'Girl 2',
          source: '/assets/models/girl2.glb',
          position: new THREE.Vector3(5, 0, 6),
          scale: new THREE.Vector3(4, 4, 4),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
      },
    };

    // Objects sets available for each scene \ location
    this.customizer = {
      desert: {
        name: 'Location 1',
        location: 'desert',
        cars: ['hummer', 'cruiser'],
        girls: ['girl2', 'girl1'],
      },
      track: {
        name: 'Location 2',
        location: 'track',
        cars: ['porsche', 'delorean'],
        girls: ['girl1', 'girl2'],
      },
    };

    this.lights = {};

    this.initConfig();
    this.setDebug();
    this.setLoadingManager();
    this.setRenderer();
    this.setUpdateMaterials();
    this.setEnvMaps();

    this.setCamera();
    // this.setNavigation();
    this.setHelpers();
    this.setLights();

    this.setWorld();

    this.loadEnvironment();
    this.renderCustomizer();

    this.setEvents();

    this.tick = this.tick.bind(this);
    this.tick();
  }

  initConfig() {
    this.config = {};

    this.config.scene = this.customizer.desert;
    this.config.car = 'hummer';
    this.config.girl = 'girl2';

    // needed for navigation
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
      debugObject: this.debugObject,
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

    // this.camera.instance.position.set(2, 4, 26);
    // this.camera.setOrbitControls(); // not using orbit controls since using custom Navigation

    // this.camera.instance.lookAt(20, 10, 5); // not working with controls enabled
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

  setEnvMaps() {
    // environment map
    const cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);

    this.debugObject.environmentMap = cubeTextureLoader.load([
      '/assets/envMaps/sf/posx.jpg',
      '/assets/envMaps/sf/negx.jpg',
      '/assets/envMaps/sf/posy.jpg',
      '/assets/envMaps/sf/negy.jpg',
      '/assets/envMaps/sf/posz.jpg',
      '/assets/envMaps/sf/negz.jpg',
    ]);

    this.debugObject.environmentMap.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.debugObject.environmentMap;
    this.scene.background = this.debugObject.environmentMap;

    // LOAD EXR

    // this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    // this.pmremGenerator.compileEquirectangularShader();

    // let exrEnvMapLoader = new EXRLoader(this.loadingManager);
    // exrEnvMapLoader.setDataType(THREE.UnsignedByteType);

    // let exrBackground;
    // let envMap;
    // let exrCubeRenderTarget;

    // let exrEnvMap = exrEnvMapLoader.load(
    //   '/assets/envMaps/room.exr',
    //   (texture) => {
    //     exrCubeRenderTarget = this.pmremGenerator.fromEquirectangular(texture);
    //     exrBackground = exrCubeRenderTarget.texture;
    //     envMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;

    //     this.debugObject.environmentMap = envMap;
    //     console.log(this.debugObject.environmentMap);

    //     // loadObjectAndAndEnvMap(); // Add envmap once the texture has been loaded

    //     texture.dispose();
    //   }
    // );
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.scene.environment = exrEnvMap;
    // this.scene.background = exrEnvMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    if (this.debug) {
      this.debug
        .add(this.debugObject, 'envMapIntensity')
        .min(0)
        .max(3)
        .step(0.01)
        .onChange(() => {
          this.updateMaterials.updateAllMaterials();
        });

      this.debug.add(this.debugObject, 'exposure').min(0).max(3).step(0.1);
    }
  }

  setHelpers() {
    this.axesHelper = new THREE.AxesHelper(10);
    this.scene.add(this.axesHelper);
  }

  tick() {
    // this.navigation.update();
    // window.requestAnimationFrame(this.tick);
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

      this.needsUpdate = true;
    });

    // Update Animation
    this.time.on('tick', () => {
      if (this.needsUpdate === true) {
        // this.renderer.render(this.scene, this.camera.instance);
        // this.renderer.toneMappingExposure = this.debugObject.exposure;
        this.render();
        this.needsUpdate = false;
      }
    });

    this.camera.on('cameraupdate', () => {
      // this.render();
      this.needsUpdate = true;
    });
    this.camera.on('cameratransitionend', () => {
      this.needsUpdate = false;
    });

    // this.setModelLoadedListener(this.girl);
  }

  render() {
    this.renderer.render(this.scene, this.camera.instance);
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
      scene: this.scene,
      updateMaterials: this.updateMaterials,
      debug: this.debug,
      loadingManager: this.loadingManager,
    });
  }

  setToConfig(objectType, car) {
    this.config[objectType] = car;
  }

  customizerSwitchCar = (car) => {
    this.setToConfig('car', car);
    this.world.reloadCar();
  };
  customizerSwitchGirl = (girl) => {
    this.setToConfig('girl', girl);
    this.world.reloadGirl();
  };

  customizerSwitchLocation = (object) => {
    this.config.scene = this.customizer[object];

    this.renderModelList(vars.customizerCarsDom, 'cars', vars.carClass);
    this.renderModelList(vars.customizerGirlsDom, 'girls', vars.girlClass);

    this.world.reloadLocation();

    this.customizerSwitchCar(this.config.scene.cars[0]);
    this.customizerSwitchGirl(this.config.scene.girls[0]);
  };
  ////////////

  loadEnvironment() {
    // plane test
    // const material = new THREE.MeshStandardMaterial({ color: '#aaaaaa' });
    // const plane = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(40, 40, 1, 1),
    //   material
    // );
    // plane.rotation.x = Math.PI * -0.5;
    // plane.position.y = 0;
    // plane.receiveShadow = true;
    // this.scene.add(plane);
  }

  getModelName(modelType, modelId) {
    return this.objects[modelType][modelId].name;
  }

  renderModelList(parentElement, modelType, itemClass) {
    if (parentElement) {
      parentElement.innerHTML = '';

      this.config.scene[modelType].forEach((model) => {
        const markup = `
          <div class="${itemClass}" data-${modelType}="${model}">${this.getModelName(
          modelType,
          model
        )}</div>
          `;

        parentElement.insertAdjacentHTML('beforeend', markup);
      });
    }
  }

  renderScenesList() {
    vars.customizerLocationsDom.innerHTML = '';

    Object.entries(this.customizer).forEach(([scene, sceneParams]) => {
      const markup = `
          <div class="${vars.locationClass}" data-location="${scene}">${sceneParams.name}</div>
          `;

      vars.customizerLocationsDom.insertAdjacentHTML('beforeend', markup);
    });
  }

  updateCustomizer() {
    // update Location list
    vars.customizerDom
      .querySelectorAll(`.${vars.locationClass}`)
      .forEach((element) => {
        element.classList.remove('active');
        if (element.dataset.location == this.config.scene.location) {
          element.classList.add('active');
          console.log('acitve location');

          console.log(element.dataset.location);
          console.log(this.config.scene.location);
        }
      });

    // Update Cars List
    vars.customizerDom
      .querySelectorAll(`.${vars.carClass}`)
      .forEach((element) => {
        element.classList.remove('active');
        if (element.dataset.cars == this.config.car) {
          element.classList.add('active');
        }
      });

    // Update Girls List
    vars.customizerDom
      .querySelectorAll(`.${vars.girlClass}`)
      .forEach((element) => {
        element.classList.remove('active');
        if (element.dataset.girls == this.config.girl) {
          element.classList.add('active');
        }
      });
  }

  renderCustomizer() {
    this.renderScenesList();

    this.renderModelList(vars.customizerCarsDom, 'cars', vars.carClass);
    this.renderModelList(vars.customizerGirlsDom, 'girls', vars.girlClass);
    this.updateCustomizer();

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains(vars.carClass)) {
        this.customizerSwitchCar(e.target.dataset.cars);
        this.updateCustomizer();
      }
      if (e.target.classList.contains(vars.girlClass)) {
        this.customizerSwitchGirl(e.target.dataset.girls);
        this.updateCustomizer();
      }
      if (e.target.classList.contains(vars.locationClass)) {
        this.customizerSwitchLocation(e.target.dataset.location);
        this.updateCustomizer();
      }
    });
  }

  // DEBUG
  setDebug() {
    this.debug = new dat.GUI({});

    this.debugObject = {
      envMapIntensity: 1,
      exposure: 1,
      removeCar: () => {
        this.removeCar();
      },
      reloadCar: () => {
        this.world.reloadCar();
      },
    };

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
