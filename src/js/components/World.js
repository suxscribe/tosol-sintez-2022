import * as THREE from 'three';
import Car from './Car';
import { isEmptyObject } from './Utils';

export default class World {
  constructor(_options) {
    this.objects = _options.objects;
    this.config = _options.config;
    this.car = _options.car;
    this.girl = _options.girl;
    this.location = _options.location;
    this.customizer = _options.customizer;
    this.scene = _options.scene;
    this.updateMaterials = _options.updateMaterials;
    this.debug = _options.debug;
    this.loadingManager = _options.loadingManager;

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

    // bloom effect
    const sphere = new THREE.SphereBufferGeometry(3, 8, 6);
  }

  removeLocation() {
    if (!isEmptyObject(this.location)) {
      this.location.removeObject();
      console.log('remove location');
    }
    this.location = {};
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
