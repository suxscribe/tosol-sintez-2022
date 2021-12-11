import * as THREE from 'three';
import Car from './Car';
import Sprite from './Sprite';

import { isEmptyObject } from './Utils';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
    this.sizes = _options.sizes;

    this.debugObject = debugObject;
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.loadLocation();
    this.loadCar();

    // this.loadGirl();
    this.loadCustom();

    this.loadSpriteGirl();
    this.loadGrain();
    this.loadCalendar();
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
    const envMapType =
      this.objects.locations[this.config.scene.location].envMapType;

    this.debugFolderEnvMap = this.debug.addFolder('envMap');

    if (envMapType == 'cube') {
      const cubeTextureLoader = new THREE.CubeTextureLoader(
        this.loadingManager
      );

      this.debugObject.environmentMap = cubeTextureLoader.load([
        envMapSource + 'px.jpg',
        envMapSource + 'nx.jpg',
        envMapSource + 'py.jpg',
        envMapSource + 'ny.jpg',
        envMapSource + 'pz.jpg',
        envMapSource + 'nz.jpg',
      ]);

      this.debugObject.environmentMap.encoding = THREE.sRGBEncoding;

      this.scene.environment = this.debugObject.environmentMap;
      // this.scene.background = this.debugObject.environmentMap;
    }
    // LOAD EXR
    else if (envMapType == 'exr') {
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
          this.debugObject.needsUpdate = true;
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
        loader: this.gltfLoader,
        textureLoader: this.textureLoader,
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
        loader: this.gltfLoader,
        textureLoader: this.textureLoader,
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
        loader: this.gltfLoader,
        textureLoader: this.textureLoader,
      });
      this.scene.add(this.girl.container);
    }
    this.setModelLoadedListener(this.girl);
  }

  loadSpriteGirl() {
    // girl object: this.objects.spritegirls[this.config.spritegirl].clothing[this.config.clothing][this.config.pose]
    if (this.config.spriteGril != '') {
      this.spriteGirl = new Sprite({
        object: this.objects.spritegirls[this.config.spritegirl],
        camera: this.camera,
        scene: this.scene,
        debug: this.debug,
        sizes: this.sizes,
        textureLoader: this.textureLoader,
        clothing: this.config.clothing,
        pose: this.config.pose,
      });
      this.camera.instance.add(this.spriteGirl.container);
    }
  }

  loadGrain() {
    this.grain = new Sprite({
      object: this.objects.grain,
      camera: this.camera,
      scene: this.scene,
      debug: this.debug,
      sizes: this.sizes,
      textureLoader: this.textureLoader,
    });
    this.camera.instance.add(this.grain.container);
  }

  loadCalendar() {
    // if (this.config.showCalendar) {
    this.calendar = new Sprite({
      object: this.objects.calendar,
      camera: this.camera,
      scene: this.scene,
      debug: this.debug,
      sizes: this.sizes,
      visible: this.config.showCalendar,
      textureLoader: this.textureLoader,
    });
    this.camera.instance.add(this.calendar.container);
    this.calendar.container.visible = this.config.showCalendar;
    // this.debugObject.needsUpdate = true;

    // } else {
    //   if (!isEmptyObject(this.calendar)) {
    //     this.calendar.removeObject();
    //     this.calendar = null;
    //   }
    // }
  }

  loadCustom() {
    // controls boundary helper
    // const bbHelper = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    // );
    // bbHelper.position.set(0, 0, 0);
    // bbHelper.scale.set(60, 60, 60);
    // this.scene.add(bbHelper);
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

  removeSpriteGirl() {
    if (!isEmptyObject(this.spriteGirl)) {
      this.spriteGirl.removeObject();
      console.log('remove sprite girl');
    }
    this.spriteGirl = {};
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
  reloadSpriteGirl() {
    this.removeSpriteGirl();
    this.loadSpriteGirl();
  }
  reloadSpriteGirlPose() {
    this.removeSpriteGirl();
    this.loadSpriteGirl();
  }

  toggleCalendar() {
    if (this.config.showCalendar === true) {
      this.spriteGirl.container.position.x -= 0.4;
    } else {
      this.spriteGirl.container.position.x += 0.4;
    }
  }
}
