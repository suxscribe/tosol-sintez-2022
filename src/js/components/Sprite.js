import * as THREE from 'three';
import Sizes from './Sizes.js';
import { debugObject } from './data/vars';

export default class Sprite {
  constructor(_options) {
    this.object = _options.object;
    this.camera = _options.camera;
    this.scene = _options.scene;
    this.debug = _options.debug;
    this.sizes = _options.sizes;
    this.visible = _options.visible;
    this.textureLoader = _options.textureLoader;
    this.clothing = _options.clothing; // todo move to object
    this.pose = _options.pose; // todo move to object

    this.container = new THREE.Object3D();

    // console.log(this.object);

    // this.loadTexture();
    if (this.object.source != '') {
      this.createSprite();
      this.setDebug();
      this.setEvents();
    }
  }

  async loadTexture() {
    if (this.clothing && this.pose) {
      this.textureSrc = this.object.clothing[this.clothing][this.pose].source;
    } else {
      this.textureSrc = this.object.source;
    }

    const textureData = await this.textureLoader.loadAsync(this.textureSrc);

    //this.createHUDSprites.bind(this)
    const sprite = textureData;
    return { sprite };
    // console.log(this.debugTexture);
  }

  async createSprite() {
    const { sprite } = await this.loadTexture();

    sprite.encoding = THREE.sRGBEncoding; // this fixes the pale look!!!!

    this.material = new THREE.SpriteMaterial({
      map: sprite,
      color: 0xffffff,
    });

    //  const width = material.map.image.width / 1000;
    //  const height = material.map.image.height / 1000;

    // width 1900
    // height 3800
    // x = 0.1;

    this.spriteObject = new THREE.Sprite(this.material);

    if (this.object.center !== undefined) {
      this.spriteObject.center.set(this.object.center.x, this.object.center.y);
    } else {
      this.spriteObject.center.set(0.5, 0.5);
    }

    // this.spriteObject.scale.set(width, height, 1);
    // this.spriteObject.position.set(0.3, 0, -3);
    // Set sprite scale
    if (this.object.scale !== undefined) {
      this.spriteObject.scale.set(
        this.object.scale.x,
        this.object.scale.y,
        this.object.scale.z
      );
    } else {
      this.spriteObject.scale.set(1, 1, 1);
    }

    // Set container position
    if (this.object.position !== undefined) {
      this.container.position.set(
        this.object.position.x,
        this.object.position.y,
        this.object.position.z
      );
    } else {
      this.container.position.set(0, 0, 0);
    }

    this.container.add(this.spriteObject);

    this.updateHUDSprites(); // set sprite size

    // Repeat texture
    if (this.object.repeat === true) {
      this.material.map.wrapS = THREE.RepeatWrapping;
      this.material.map.wrapT = THREE.RepeatWrapping;

      const repeatX = Math.ceil(
        this.sizes.width / this.material.map.image.width
      );
      const repeatY = Math.ceil(
        this.sizes.height / this.material.map.image.height
      );

      this.material.map.offset.set(0, 0);
      this.material.map.repeat.set(repeatX, repeatY);

      this.container.scale.set(
        this.sizes.width * this.getScreenFactor(),
        this.sizes.height * this.getScreenFactor(),
        1
      );
    }

    if (this.visible === false) {
      this.container.visible = this.visible;
    }
  }
  updateHUDSprites() {
    const width = this.material.map.image.width * this.getScreenFactor();
    const height = this.material.map.image.height * this.getScreenFactor();

    // this.spriteObject.position.set(-width, height, 1); // top left
    this.container.scale.set(width, height, 1);
  }

  setEvents() {
    this.sizes.on('resize', () => {
      // this.updateHUDSprites();
    });
  }

  setDebug() {
    if (this.debug) {
      this.debugFolderSprite = this.debug.addFolder(
        'Sprite ' + this.object.name
      );
      this.debugFolderSprite
        .add(this.container.position, 'z')
        .min(-3)
        .max(3)
        .step(0.01);
      this.debugFolderSprite
        .add(this.container.position, 'y')
        .min(-3)
        .max(3)
        .step(0.01);
      this.debugFolderSprite
        .add(this.container.position, 'x')
        .min(-3)
        .max(3)
        .step(0.01);
    }
  }

  getScreenFactor() {
    // return this.sizes.height * 0.0005 * 0.001; // this.sizes.width * 0.0005
    return 0.0005; // this.sizes.width * 0.0005
  }

  removeObject() {
    this.container.traverse((child) => {
      if (child.hasOwnProperty('geometry')) {
        child.geometry.dispose();
      }
      if (child.hasOwnProperty('material')) {
        if (child.material) {
          child.material.dispose();
        }
      }
      this.camera.instance.remove(child);
      // child.removeFromParent() // alternate way to remove object. without passing scene.
    });
    this.container = null;

    if (this.debugFolderSprite) {
      this.debug.removeFolder(this.debugFolderSprite);
    }
    debugObject.needsUpdate = true;
  }
}
