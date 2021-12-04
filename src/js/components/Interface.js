// const customizerDom = document.querySelector('.customizer');
// const customizerLocationsDom = document.querySelector('.customizer__locations');
// const customizerCarsDom = document.querySelector('.customizer__cars');
// const customizerGirlsDom = document.querySelector('.customizer__girls');

// const carClass = 'customizer__car';
// const girlClass = 'customizer__girl';
import tippy from 'tippy.js';
import MicroModal from 'micromodal';

import { vars, objectsData, customizerData, debugObject } from './data/vars';

export default class World {
  constructor(_options) {
    this.config = _options.config;
    this.world = _options.world;
    this.renderer = _options.renderer;
    this.updateMaterials = _options.updateMaterials;

    this.objects = objectsData; // Models data
    this.debugObject = debugObject;
    this.customizer = customizerData; // Objects sets available for each scene \ location

    this.setEvents();
    this.renderCustomizer();

    tippy('[data-tippy-content]', {
      placement: 'right',
    });
  }

  setEvents() {
    MicroModal.init({
      // onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
      // onClose: (modal) => console.info(`${modal.id} is hidden`), // [2]
      openTrigger: 'data-micromodal-open',
      closeTrigger: 'data-micromodal-close',
      openClass: 'is-open',
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
    });

    document
      .querySelector('.customizer__screenshoter-make')
      .addEventListener('click', () => {
        this.takeScreenshot();
      });

    // Change car color
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__car-color')) {
        console.log('color' + e.target.dataset.color);
        this.updateMaterials.changeCarColor(e.target.dataset.color);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__car-texture')) {
        console.log('texture');
        this.updateMaterials.changeCarTexture();
      }
    });

    // close select bar
    document.addEventListener('click', (e) => {
      if (
        e.target.closest('.customizer__control-bar-close') ||
        e.target.classList.contains(vars.canvasClass)
      ) {
        const parent = e.target.closest(`.${vars.customizerControlBarClass}`);
        if (parent) {
          parent.classList.remove(vars.visibleClass);
        } else {
          document
            .querySelectorAll(`.${vars.customizerControlBarClass}`)
            .forEach((bar) => {
              bar.classList.remove(vars.visibleClass);
            });
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__button')) {
        if (e.target.dataset.bar != '') {
          const bar = document.querySelector(
            '.customizer__control-bar--' + e.target.dataset.bar
          );
          if (bar) {
            bar.classList.add(vars.visibleClass);
          }
        }
      }
    });

    // Toggle calendar
    vars.customizerToggleCalendarDom.addEventListener('click', () => {
      if (this.config.showCalendar) {
        this.config.showCalendar = false;
        vars.customizerToggleCalendarDom.classList.remove('active');
      } else {
        this.config.showCalendar = true;
        vars.customizerToggleCalendarDom.classList.add('active');
      }
      this.debugObject.needsToggleCalendar = true;
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
  customizerSwitchSpriteGirl = (spriteGirl) => {
    this.setToConfig('spritegirl', spriteGirl);
    this.world.reloadSpriteGirl();
  };

  customizerSwitchLocation = (object) => {
    this.config.scene = this.customizer[object];

    this.renderModelList(vars.customizerCarsDom, 'cars', vars.carClass);
    this.renderModelList(vars.customizerGirlsDom, 'girls', vars.girlClass);
    this.renderModelList(
      vars.customizerSpriteGirlsDom,
      'spritegirls',
      vars.spriteGirlClass
    );

    this.world.reloadLocation();

    // this.customizerSwitchCar(this.config.scene.cars[0]); // disabled to keep same models
    // this.customizerSwitchGirl(this.config.scene.girls[0]); //disabled to keep same models
  };
  ////////////

  getModelName(modelType, modelId) {
    return this.objects[modelType][modelId].name;
  }

  renderModelList(parentElement, modelType, itemClass) {
    if (parentElement) {
      parentElement.innerHTML = '';

      this.config.scene[modelType].forEach((model) => {
        const markup = `
          <div class="customizer__control-item ${itemClass}" data-${modelType}="${model}">${this.getModelName(
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
    console.log('render scenes');

    Object.entries(this.customizer).forEach(([scene, sceneParams]) => {
      const markup = `
          <div class="customizer__control-item ${vars.locationClass}" data-location="${scene}">${sceneParams.name}</div>
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

    // Update Sprite Girls List
    vars.customizerDom
      .querySelectorAll(`.${vars.spriteGirlClass}`)
      .forEach((element) => {
        element.classList.remove('active');
        if (element.dataset.spritegirls == this.config.spritegirl) {
          element.classList.add('active');
        }
      });
  }

  renderCustomizer() {
    this.renderScenesList();

    this.renderModelList(vars.customizerCarsDom, 'cars', vars.carClass);
    this.renderModelList(vars.customizerGirlsDom, 'girls', vars.girlClass);
    this.renderModelList(
      vars.customizerSpriteGirlsDom,
      'spritegirls',
      vars.spriteGirlClass
    );
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
      if (e.target.classList.contains(vars.spriteGirlClass)) {
        this.customizerSwitchSpriteGirl(e.target.dataset.spritegirls);
        this.updateCustomizer();
      }
      if (e.target.classList.contains(vars.locationClass)) {
        this.customizerSwitchLocation(e.target.dataset.location);
        this.updateCustomizer();
      }
    });
  }

  // ScreenShots
  takeScreenshot() {
    this.debugObject.needsScreenshot = true;
    this.debugObject.needsUpdate = true;
  }

  saveAsImage() {
    let imgData;
    let strDownloadMime = 'image/octet-stream';

    try {
      let strMime = 'image/jpeg';
      imgData = this.renderer.domElement.toDataURL(strMime);

      this.saveFile(imgData.replace(strMime, strDownloadMime), 'test.jpg');
      this.debugObject.needsUpdate = true; // render with original size after resize
    } catch (e) {
      console.log(e);
      return;
    }
  }
  saveFile(strData, filename) {
    let link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
    } else {
      location.replace(uri);
    }
  }
}
