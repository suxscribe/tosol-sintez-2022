import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { isEmptyObject } from './Utils';
import Time from '../utils/Time';
import UpdateMaterials from './UpdateMaterials.js';
import Camera from './Camera.js'; // camera constructor
import Sizes from './Sizes.js';

import { debugObject } from './data/debug';

// import BoxCar from './BoxCar.js';
import Car from './Car.js';

// gsap.registerPlugin(CustomEase);

export default class App {
  constructor(_options) {
    this.canvas = document.querySelector('.webgl');
    this.time = new Time();
    this.sizes = new Sizes();
    this.model = [];

    this.debugObject = {
      removeCar: () => {
        this.removeCar();
      },
      reloadCar: () => {
        this.removeCar();
        this.loadCar();
      },
    };

    this.objects = {
      environment: {},
      cars: {
        hummer: {
          name: 'hummer',
          source: '/assets/models/hummerhx4.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(0.08, 0.08, 0.08),
          rotation: new THREE.Euler(0, Math.PI * -0.5, 0),
        },
        car2: {
          name: 'car2',
          source: '/assets/models/landcruiser/landcruiser.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(2, 2, 2),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
        delorean: {
          name: 'delorean',
          source: '/assets/models/delorean.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(2, 2, 2),
          rotation: new THREE.Euler(0, 0, 0),
        },
        porsche: {
          name: 'porsche',
          source: '/assets/models/porsche/porsche.glb',
          position: new THREE.Vector3(0, 0, 0),
          scale: new THREE.Vector3(3.5, 3.5, 3.5),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
      },
      girls: {
        girl1: {
          name: 'girl1',
          source: '/assets/models/girl1.glb',
          position: new THREE.Vector3(5, 0, 6),
          scale: new THREE.Vector3(1, 1, 1),
          rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
        },
      },
    };

    this.config = {};

    this.initConfig();
    this.setDebug();

    this.setEnvMaps();

    this.setRenderer();
    this.setCamera();
    this.setHelpers();
    this.setEvents();

    this.setLights();

    this.loadCar();
    // this.loadCar2();
    this.loadGirl();

    this.loadEnvironment();
    // this.loadBoxCar();

    this.tick = this.tick.bind(this); // dont know why but it works
    this.tick();

    console.log('debug object');
    console.log(debugObject);
  }

  setRenderer() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color('#eeeeee');
    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;

    this.updateMaterials = new UpdateMaterials({
      scene: this.scene,
      environmentMap: this.environmentMap,
    });

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setPixelRatio(2); // Math.min(window.devicePixelRatio,
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    this.camera.instance.position.set(20, 4, 9);
    // this.camera.instance.lookAt(20, 10, 5); // not working with controls enabled
  }

  setLights() {
    // Ligting
    const ambientLight = new THREE.AmbientLight({
      color: '#ffffff',
      intensity: 1,
    });
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    this.directionalLight.position.set(6.5, 9.1, 7.8);
    this.directionalLightTarget = new THREE.Object3D(0, 0, 0);
    this.directionalLight.target = this.directionalLightTarget;
    this.scene.add(this.directionalLightTarget);
    // this.directionalLight.target.set(0, 0, 0);

    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.far = 30;

    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.bottom = -10;

    this.scene.add(this.directionalLight);

    this.directionalLightCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );
    this.scene.add(this.directionalLightCameraHelper);

    this.debugFolderLight = this.debug.addFolder('Directional Light');
    this.debugFolderLight
      .add(this.directionalLight.position, 'x')
      .min(-10)
      .max(20)
      .step(0.1)
      .name('Light x');
    this.debugFolderLight
      .add(this.directionalLight.position, 'y')
      .min(-10)
      .max(20)
      .step(0.1)
      .name('Light y');
    this.debugFolderLight
      .add(this.directionalLight.position, 'z')
      .min(-10)
      .max(20)
      .step(0.1)
      .name('Light z');
    this.debugFolderLight
      .add(this.directionalLightTarget.position, 'x')
      .min(-10)
      .max(20)
      .step(0.1)
      .name('Light x');
    this.debugFolderLight
      .add(this.directionalLightTarget.position, 'y')
      .min(-10)
      .max(20)
      .step(0.1)
      .name('Light y');
    this.debugFolderLight
      .add(this.directionalLightTarget.position, 'z')
      .min(-10)
      .max(20)
      .step(0.1)
      .name('Light z');
    this.debugFolderLight.close();
  }

  setEnvMaps() {
    // environment map
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    this.environmentMap = cubeTextureLoader.load([
      '/assets/envMaps/bridge/posx.jpg',
      '/assets/envMaps/bridge/negx.jpg',
      '/assets/envMaps/bridge/posy.jpg',
      '/assets/envMaps/bridge/negy.jpg',
      '/assets/envMaps/bridge/posz.jpg',
      '/assets/envMaps/bridge/negz.jpg',
    ]);

    this.environmentMap.encoding = THREE.sRGBEncoding;

    this.debugObject.envMapIntensity = 1;

    if (this.debug) {
      this.debug
        .add(debugObject, 'envMapIntensity')
        .min(0)
        .max(10)
        .step(0.01)
        .onChange(() => {
          // this.updateAllMaterials();
          this.updateMaterials.updateAllMaterials();
        });
    }

    // LOAD EXR
    // const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    // pmremGenerator.compileEquirectangularShader();

    // const exrEnvMapLoader = new EXRLoader();

    // exrEnvMapLoader.setDataType(THREE.UnsignedByteType);

    // this.exrBackground = '';
    // this.envMap = '';

    // const exrEnvMap = exrEnvMapLoader.load(
    //   '/assets/envMaps/room.exr',
    //   function (texture) {
    //     var exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
    //     this.exrBackground = exrCubeRenderTarget.texture;
    //     this.envMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;

    //     // loadObjectAndAndEnvMap(); // Add envmap once the texture has been loaded

    //     texture.dispose();
    //   }
    // );

    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;

    // // this.scene.background = exrEnvMap;
    // console.log(exrEnvMap);

    // this.scene.environment = this.envMap;
  }

  setHelpers() {
    this.axesHelper = new THREE.AxesHelper(10);
    this.scene.add(this.axesHelper);
  }

  tick() {
    // this.controls.update();
    this.renderer.render(this.scene, this.camera.instance);
    window.requestAnimationFrame(this.tick);
  }

  setEvents() {
    window.addEventListener('resize', () => {
      this.camera.instance.aspect = this.sizes.width / this.sizes.height;
      this.camera.instance.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
      // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      console.log(this.sizes);
    });
  }

  ////////////

  initConfig() {
    this.config.car = 'hummer';
    this.config.girl = 'girl1';
  }

  removeCar() {
    if (!isEmptyObject(this.car)) {
      this.car.removeObject();
      console.log('remove car');
    }
    this.car = {};
  }

  removeGirl() {
    if (!isEmptyObject(this.girl)) {
      this.girl.removeObject();
      console.log('remove girl');
    }
    this.girl = {};
  }

  setCar(car) {
    this.config.car = car;
  }

  setGirl(girl) {
    this.config.girl = girl;
  }

  reloadCar() {
    this.removeCar();
    this.loadCar();
  }

  ////////////

  loadCar() {
    this.car = new Car({
      object: this.objects.cars[this.config.car],
      scene: this.scene,
      debug: this.debug,
    });
    this.scene.add(this.car.container);
  }

  loadGirl() {
    this.girl = new Car({
      object: this.objects.girls[this.config.girl],
      scene: this.scene,
      debug: this.debug,
    });
    this.scene.add(this.girl.container);
  }

  loadEnvironment() {
    // plane test
    const material = new THREE.MeshStandardMaterial({ color: '#aaaaaa' });

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(40, 40, 1, 1),
      material
    );
    plane.rotation.x = Math.PI * -0.5;
    plane.position.y = 0;
    plane.receiveShadow = true;

    this.scene.add(plane);

    // this.updateAllMaterials();
    // this.updateMaterials.updateAllMaterials();
  }

  loadBoxCar() {
    this.boxCar = new BoxCar();
    this.scene.add(this.boxCar.container);
  }

  setDebug() {
    this.debug = new dat.GUI({});

    this.debug.add(this.debugObject, 'removeCar').name('Remove Car');
    this.debug.add(this.debugObject, 'reloadCar').name('Reload Car');

    this.debug
      .add(this.config, 'car', {
        hummer: 'hummer',
        cruiser: 'car2',
        delorean: 'delorean',
        porsche: 'porsche',
      })
      .name('Config Car')
      .onChange(() => {
        this.reloadCar();
      });
    // this.debug.add(this.config, 'girl').name('Config Girl');
  }
}
