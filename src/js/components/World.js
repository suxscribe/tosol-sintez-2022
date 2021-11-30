import * as THREE from 'three';
import Car from './Car';
import { isEmptyObject } from './Utils';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { debugObject } from './data/vars';

export default class World {
  constructor(_options) {
    this.objects = _options.objects;
    this.config = _options.config;
    this.car = _options.car;
    this.girl = _options.girl;
    this.location = _options.location;
    this.customizer = _options.customizer;
    this.renderer = _options.renderer;
    this.scene = _options.scene;
    this.updateMaterials = _options.updateMaterials;
    this.debug = _options.debug;
    this.loadingManager = _options.loadingManager;
    this.camera = _options.camera;

    this.debugObject = debugObject;

    this.loadLocation();
    this.loadCar();
    this.loadGirl();
    this.loadEnvironment();
  }

  setModelLoadedListener(object) {
    object.on('loaded', () => {
      console.log('Car loaded event');
      this.updateMaterials.updateAllMaterials(); //todo remove if texture loads correctly
    });
  }

  loadEnvMap() {
    console.log('loading envmap');

    const envMapSource =
      this.objects.locations[this.config.scene.location].envMapSource;

    this.debugFolderEnvMap = this.debug.addFolder('envMap');

    if (
      this.objects.locations[this.config.scene.location].envMapType == 'cube'
    ) {
      const cubeTextureLoader = new THREE.CubeTextureLoader(
        this.loadingManager
      );

      this.debugObject.environmentMap = cubeTextureLoader.load([
        envMapSource + 'posx.jpg',
        envMapSource + 'negx.jpg',
        envMapSource + 'posy.jpg',
        envMapSource + 'negy.jpg',
        envMapSource + 'posz.jpg',
        envMapSource + 'negz.jpg',
      ]);

      this.debugObject.environmentMap.encoding = THREE.sRGBEncoding;

      this.scene.environment = this.debugObject.environmentMap;
      this.scene.background = this.debugObject.environmentMap;
    }
    // LOAD EXR
    else if (
      this.objects.locations[this.config.scene.location].envMapType == 'exr'
    ) {
      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.pmremGenerator.compileEquirectangularShader();

      let exrEnvMapLoader = new EXRLoader(this.loadingManager);
      exrEnvMapLoader.setDataType(THREE.UnsignedByteType);

      let exrBackground;
      let envMap;
      let exrCubeRenderTarget;

      let exrEnvMap = exrEnvMapLoader.load(envMapSource, (texture) => {
        exrCubeRenderTarget = this.pmremGenerator.fromEquirectangular(texture);
        exrBackground = exrCubeRenderTarget.texture;
        envMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;

        this.debugObject.environmentMap = envMap;
        // console.log(this.debugObject.environmentMap);

        this.scene.background = exrBackground; // correct way to load exr background. but lowres

        texture.dispose();
      });
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.scene.environment = exrEnvMap;
    }
    // EXR END

    if (this.debug) {
      this.debugFolderEnvMap
        .add(this.debugObject, 'envMapIntensity')
        .min(0)
        .max(3)
        .step(0.01)
        .onChange(() => {
          this.updateMaterials.updateAllMaterials();
        });

      this.debugFolderEnvMap
        .add(this.debugObject, 'exposure')
        .min(0)
        .max(3)
        .step(0.1);
    }
  }

  loadLocation() {
    if (this.config.scene != '') {
      this.location = new Car({
        object: this.objects.locations[this.config.scene.location],
        scene: this.scene,
        debug: this.debug,
        loadingManager: this.loadingManager,
      });
      this.scene.add(this.location.container);
    }
    this.loadEnvMap();
    this.setModelLoadedListener(this.location);
  }

  loadCar() {
    if (this.config.car != '') {
      this.car = new Car({
        object: this.objects.cars[this.config.car],
        scene: this.scene,
        debug: this.debug,
        loadingManager: this.loadingManager,
      });
      this.scene.add(this.car.container);
    }
    this.setModelLoadedListener(this.car);
  }

  loadGirl() {
    if (this.config.girl != '') {
      this.girl = new Car({
        object: this.objects.girls[this.config.girl],
        scene: this.scene,
        debug: this.debug,
        loadingManager: this.loadingManager,
      });
      this.scene.add(this.girl.container);
    }
    this.setModelLoadedListener(this.girl); //todo change object to .girl
  }

  loadEnvironment() {
    // controls boundary helper
    // const bbHelper = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    // );
    // bbHelper.position.set(0, 0, 0);
    // bbHelper.scale.set(60, 60, 60);
    // this.scene.add(bbHelper);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/textures/girl2.png',
      this.createHUDSprites.bind(this)
    );
  }

  createHUDSprites(texture) {
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
    });
    const width = material.map.image.width / 1000;
    const height = material.map.image.height / 1000;

    this.spriteTL = new THREE.Sprite(material);

    this.spriteTL.center.set(0.0, 1.0);
    this.spriteTL.scale.set(width, height, 1);
    this.spriteTL.position.set(0, 0, -5);

    this.camera.instance.add(this.spriteTL);

    this.debug.add(this.spriteTL.position, 'z').min(-20).max(20).step(0.1);
    this.debug.add(this.spriteTL.position, 'y').min(-20).max(20).step(0.1);
    this.debug.add(this.spriteTL.position, 'x').min(-20).max(20).step(0.1);

    // this.updateHUDSprites(); // needs fixing
  }
  updateHUDSprites() {
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;

    this.spriteTL.position.set(-width, height, 1); // top left
    // spriteTR.position.set( width, height, 1 ); // top right
    // spriteBL.position.set( - width, - height, 1 ); // bottom left
    // spriteBR.position.set( width, - height, 1 ); // bottom right
    // spriteC.position.set( 0, 0, 1 ); // center
  }

  removeLocation() {
    if (!isEmptyObject(this.location)) {
      this.location.removeObject();
      console.log('remove location');
    }
    this.location = {};

    this.scene.environment = null;
    this.scene.background = null;
    this.debugObject.environmentMap = null;

    this.debug.removeFolder(this.debugFolderEnvMap);
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

  // setToConfig(objectType, car) {
  //   this.config[objectType] = car;
  // }

  reloadLocation() {
    this.removeLocation();
    this.loadLocation();
  }
  reloadCar() {
    this.removeCar();
    this.loadCar();
  }
  reloadGirl() {
    this.removeGirl();
    this.loadGirl();
  }
}
