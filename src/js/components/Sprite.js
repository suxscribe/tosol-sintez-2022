import * as THREE from 'three';
import Sizes from './Sizes.js';
import { debugObject } from './data/vars';
import { isIos } from './Utils.js';

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
      if (isIos() && this.object.clothing[this.clothing][this.pose].sourceFallback !== '') {
        this.textureSrc = this.object.clothing[this.clothing][this.pose].sourceFallback; // load png girl textures on ios devices instead of webp
      } else {
        this.textureSrc = this.object.clothing[this.clothing][this.pose].source; // load default texture (webp or png)
      }
    } else {
      this.textureSrc = this.object.source;
    }

    const textureData = await this.textureLoader.loadAsync(this.textureSrc);

    const sprite = textureData;
    return { sprite };
  }

  async createSprite() {
    const { sprite } = await this.loadTexture();

    sprite.encoding = THREE.sRGBEncoding; // this fixes the pale look!!!!

    this.material = new THREE.SpriteMaterial({
      map: sprite,
      color: 0xffffff,
    });
    this.spriteObject = new THREE.Sprite(this.material);

    // Set Center
    if (this.object.center !== undefined) {
      this.spriteObject.center.set(this.object.center.x, this.object.center.y);
    } else {
      this.spriteObject.center.set(0.5, 0.5);
    }

    // Set sprite scale
    if (this.object.scale !== undefined) {
      this.container.scale.set(this.object.scale.x, this.object.scale.y, this.object.scale.z); // was this.container.scale
    } else {
      this.container.scale.set(1, 1, 1);
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

      const repeatX = Math.ceil(this.sizes.width / this.material.map.image.width);
      const repeatY = Math.ceil(this.sizes.height / this.material.map.image.height);

      this.material.map.offset.set(0, 0);
      this.material.map.repeat.set(repeatX, repeatY);

      this.container.scale.set(
        this.sizes.width * this.getScreenFactor(),
        this.sizes.height * this.getScreenFactor(),
        1
      );
    }

    this.container.visible = this.visible;
  }
  updateHUDSprites(width = null, height = null) {
    let newWidth;
    let newHeight;
    if (width && height) {
      newWidth = width;
      newHeight = height;
    } else {
      newWidth = this.sizes.width;
      newHeight = this.sizes.height;
    }

    if (this.object.isOrtho === true) {
      const materialWidth =
        (this.material.map.image.width * newHeight) / this.material.map.image.height;
      const materialHeight = newHeight;

      this.spriteObject.scale.set(materialWidth, materialHeight, 1);

      if (this.object.align === 'right') {
        this.spriteObject.position.set(newWidth / 2, 0, 0); //  // this.sizes.width
      }
      if (this.object.align === 'left') {
        this.spriteObject.position.set(-newWidth / 2, 0, 0);
      }
    } else {
      const width = this.material.map.image.width * this.getScreenFactor();
      const height = this.material.map.image.height * this.getScreenFactor();

      this.container.scale.set(width, height, 1);
    }
  }

  setEvents() {
    this.sizes.on('resize', () => {
      this.updateHUDSprites();
    });
  }

  setDebug() {
    if (this.debug && debugObject.showDebug === true) {
      this.debugFolderSprite = this.debug.addFolder('Sprite ' + this.object.name);
      this.debugFolderSprite
        .add(this.container.position, 'z')
        .min(-3)
        .max(3)
        .step(0.01)
        .onChange(() => {
          debugObject.needsUpdate = true;
        });
      this.debugFolderSprite
        .add(this.container.position, 'y')
        .min(-1000)
        .max(1000)
        .step(0.01)
        .onChange(() => {
          debugObject.needsUpdate = true;
        });
      this.debugFolderSprite
        .add(this.container.position, 'x')
        .min(-1000)
        .max(1000)
        .step(0.01)
        .onChange(() => {
          debugObject.needsUpdate = true;
        });
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
    // this.container = null; // causes promise error for some reason

    if (this.debugFolderSprite) {
      this.debug.removeFolder(this.debugFolderSprite);
    }
    debugObject.needsUpdate = true;
  }
}
