import tippy from 'tippy.js';
import MicroModal from 'micromodal';

import { vars, objectsData, customizerData, debugObject } from './data/vars';
import { showRotateOverlay } from '../utils/showOverlay';
import { isIos } from './Utils';

export default class Interface {
  constructor(_options) {
    this.config = _options.config;
    this.world = _options.world;
    this.renderer = _options.renderer;
    this.updateMaterials = _options.updateMaterials;
    this.sizes = _options.sizes;
    this.screenshot = _options.screenshot;

    this.api = 'script.php';

    this.objects = objectsData; // Models data
    this.debugObject = debugObject;
    this.customizer = customizerData; // Objects sets available for each scene \ location

    this.setEvents();
    this.renderCustomizer();
    this.renderColorsList();
    this.showFullscreenButton();
    showRotateOverlay(this.sizes.width, this.sizes.height);

    tippy('[data-tippy-content]', {
      placement: 'right',
      arrow: false,
      offset: [0, 20],
    });
  }

  modalSwitchToTab(tabIndex) {
    vars.customizerModalTabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    vars.customizerModalTabs[tabIndex].classList.add('active');
  }

  renderColorsList() {
    if (vars.customizerCarColorsDom) {
      vars.carColors.forEach((color) => {
        const markup = `
        <div class="customizer__control-colors-item customizer__car-color ${
          color[1] === this.config.carColor ? 'active' : ''
        }" data-color="${color[1]}" style="background-color: ${color[0]}"></div>
          `;
        vars.customizerCarColorsDom.insertAdjacentHTML('beforeend', markup);
      });
    }
  }

  customizerSetCarColor(color) {
    this.config.carColor = color;
    this.updateMaterials.changeCarColor(color);

    document.querySelectorAll(`.${vars.carColorClass}`).forEach((element) => {
      element.classList.remove('active');
      if (element.dataset.color == this.config.carColor)
        element.classList.add('active');
    });
    // e.target.classList.add('active');
  }

  setEvents() {
    MicroModal.init({
      openTrigger: 'data-micromodal-open',
      closeTrigger: 'data-micromodal-close',
      openClass: 'is-open',
      disableScroll: true,
      disableFocus: true,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
    });

    // MicroModal.show('modal-gift'); // testing

    this.sizes.on('resize', () => {
      showRotateOverlay(this.sizes.width, this.sizes.height);
    });

    // Make Screenshot

    document.addEventListener('click', (e) => {
      // Set screenshot size to config
      if (e.target.classList.contains(vars.screenshotSizeClass)) {
        this.config.screenshotSize.width = e.target.dataset.width;
        this.config.screenshotSize.height = e.target.dataset.height;

        document
          .querySelectorAll(`.${vars.screenshotSizeClass}`)
          .forEach((element) => {
            element.classList.remove('active');
          });
        e.target.classList.add('active');
      }

      // Download screenshot with selected size
      if (e.target.classList.contains(vars.screenshotDownloadButtonClass)) {
        // Get selected size
        const selectedScreenshotSize = document.querySelector(
          `.${vars.screenshotSizeClass}.active`
        );
        if (selectedScreenshotSize) {
          this.config.screenshotSize.width =
            selectedScreenshotSize.dataset.width;
          this.config.screenshotSize.height =
            selectedScreenshotSize.dataset.height;
        } else {
          this.config.screenshotSize.width =
            this.debugObject.screenshotSizes.preview.dataset.width;
          this.config.screenshotSize.height =
            this.debugObject.screenshotSizes.preview.dataset.height;
        }

        this.screenshot.takeScreenshot('download');
      }

      // open share modal and make preview screenshot
      if (e.target.classList.contains('customizer__download-button')) {
        this.screenshot.takeScreenshot('preview');
      }
      if (
        e.target.classList.contains('customizer__share-button') ||
        e.target.closest('.customizer__share-button')
      ) {
        this.screenshot.takeScreenshot('share');
      }

      // open gift modal and make screenshot
      if (e.target.classList.contains('customizer__gift')) {
        this.screenshot.takeScreenshot('gift');

        this.modalSwitchToTab(0);
      }

      // switch to next tab
      if (e.target.classList.contains(vars.modalTabButtonClass)) {
        this.modalSwitchToTab(1);
      }
    });

    // Checkbox "Add calendar"
    vars.formInputCalendarCheckbox.addEventListener('change', (e) => {
      const showCalendar = vars.formInputCalendarCheckbox.checked
        ? true
        : false;
      this.setToConfig('showCalendar', showCalendar);

      this.screenshot.takeScreenshot('preview');
    });

    document.addEventListener('click', (e) => {
      // Change car color on color click
      if (e.target.classList.contains(vars.carColorClass)) {
        this.customizerSetCarColor(e.target.dataset.color);
      }

      // Generate Click. Random Car & Girl & Color Set
      if (e.target.classList.contains('customizer__generate-button')) {
        console.log('random');

        // select random car - store to config
        this.customizerSwitchCar(this.getRandomProp(objectsData.cars));

        // select random sprite girl - store to config
        const propSpriteGirl = this.getRandomProp(
          objectsData.spritegirls,
          true
        );

        this.customizerSwitchSpriteGirl(propSpriteGirl);

        // select random girl clothing \ pose - store to config
        let propSpriteGirlPose = 'pose1';
        let propSpriteGirlClothing = 'clothing1';
        if (
          objectsData.spritegirls[propSpriteGirl].clothing.clothing1 !==
          undefined
        ) {
          propSpriteGirlClothing = this.getRandomProp(
            objectsData.spritegirls[propSpriteGirl].clothing
          );
          propSpriteGirlPose = this.getRandomProp(
            objectsData.spritegirls[propSpriteGirl].clothing.clothing1
          );
        }

        this.customizerSwitchSpriteGirlPose(
          propSpriteGirlClothing,
          propSpriteGirlPose
        );

        // select random color
        const random = Math.floor(Math.random() * vars.carColors.length);
        this.customizerSetCarColor(vars.carColors[random][1]);

        this.updateCustomizer();
      }
    });

    // close control bar
    document.addEventListener('click', (e) => {
      if (
        e.target.closest(`.${vars.customizerControlBarCloseClass}`) ||
        e.target.classList.contains(vars.canvasClass)
      ) {
        this.closeControlBars();
      }

      // open control bar
      if (e.target.classList.contains(vars.customizerButtonClass)) {
        if (e.target.dataset.bar != '') {
          const bar = document.querySelector(
            '.customizer__control-bar--' + e.target.dataset.bar
          );
          if (bar) {
            bar.classList.add(vars.visibleClass);
            this.toggleControlButtons(false);
          }
        }
      }

      // Toggle Girls params bar
      if (e.target.classList.contains(vars.customizerGirsParamsButtonClass)) {
        if (vars.customizerSpriteGirlsSubbarDom.classList.contains('visible')) {
          vars.customizerSpriteGirlsSubbarDom.classList.remove('visible');
        } else {
          vars.customizerSpriteGirlsSubbarDom.classList.add('visible');
        }
      }
    });

    // FORM SEND
    if (vars.formDom) {
      vars.formDom.addEventListener('submit', this.formSend);
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__fullscreen')) {
        console.log('fullscreenEnabled', document.fullscreenEnabled); // can enter fullscreen?

        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          vars.fullscreenButtonDom.classList.add('active');
        } else {
          if (document.fullscreenEnabled) {
            document.exitFullscreen();
            vars.fullscreenButtonDom.classList.remove('active');
          }
        }
      }
    });
  }

  getRandomProp(object, plusOne = null) {
    // console.log('getRandomProp', object);

    const keys = Object.keys(object);
    if (plusOne) {
      return keys[Math.floor(Math.random() * (keys.length - 1) + 1)];
    } else {
      return keys[Math.floor(Math.random() * keys.length)];
    }
  }

  async formSend(e) {
    e.preventDefault();
    const giftCodeValue = vars.formGiftCodeInputDom.value;

    if (giftCodeValue.toUpperCase() === vars.formGiftCodeMatch.toUpperCase()) {
      let formData = new FormData(vars.formDom);
      // formData.append('image', formImage.files[0]);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      vars.formDom.classList.add('sending');

      let response = await fetch('sendmail.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        let result = await response.json();
        // console.log(result.message);
        vars.formDom.reset();
        vars.formDom.classList.add('send');
        MicroModal.close('modal-gift');
        MicroModal.show('modal-sent');
      } else {
      }
    } else {
      alert('Введен неверный код');
    }
  }

  closeControlBars() {
    document
      .querySelectorAll(`.${vars.customizerControlBarClass}`)
      .forEach((bar) => {
        bar.classList.remove(vars.visibleClass);
      });
    vars.customizerSpriteGirlsSubbarDom.classList.remove('visible'); // hide girl pose switch
    this.toggleControlButtons(true);
  }

  toggleControlButtons(show) {
    if (show) {
      vars.customizerButtonsDom.classList.remove('hidden');
    } else {
      vars.customizerButtonsDom.classList.add('hidden');
    }
  }

  setToConfig(objectType, value) {
    this.config[objectType] = value;
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

    if (this.config.spritegirl == 'girl0') {
      // hide girs pose \ clothing control for girl0
      if (vars.customizerGirlsParamsControlWrap) {
        vars.customizerGirlsParamsControlWrap.classList.add('hidden');
      }
      if (vars.customizerSpriteGirlsSubbarDom) {
        vars.customizerSpriteGirlsSubbarDom.classList.remove('visible');
      }
    } else {
      if (vars.customizerGirlsParamsControlWrap) {
        vars.customizerGirlsParamsControlWrap.classList.remove('hidden');
      }
    }
  };
  customizerSwitchSpriteGirlPose = (clothing, pose) => {
    this.setToConfig('clothing', clothing);
    this.setToConfig('pose', pose);
    console.log(clothing, pose);

    this.world.reloadSpriteGirlPose();
  };

  customizerSwitchLocation = (object) => {
    this.setToConfig('scene', this.customizer[object]);

    // update Customizer Elements corresponding to cars & girls available to current location
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

  renderModelList(parentElement, modelType, itemClass) {
    if (parentElement) {
      parentElement.innerHTML = '';

      this.config.scene[modelType].forEach((model) => {
        const markup = `
          <div class="customizer__control-item ${itemClass}" data-${modelType}="${model}">
        <img src="${this.getModelPreview(
          modelType,
          model
        )}" alt="${this.getModelName(modelType, model)}" />
        </div>
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
          <div class="customizer__control-item ${
            vars.locationClass
          }" data-location="${scene}">
          <img src="${this.getModelPreview(
            'locations',
            scene
          )}" alt="${this.getModelName('locations', scene)}" />
          </div>
          `;

      vars.customizerLocationsDom.insertAdjacentHTML('beforeend', markup);
    });
  }

  // GIrls Pose & Clothing variations
  renderGirlParams() {
    // const girl = 'girl1';
    const girl = this.config.spritegirl;
    let markup = '';

    vars.customizerGirlsParamsDom.innerHTML = '';

    let i = 1;
    Object.entries(objectsData.spritegirls[girl].clothing).forEach(
      ([clothingType, poseList]) => {
        markup += `
        <ul class="customizer__control-girls-params-sublist customizer__control-girls-params-pose-list">`;

        // <div class=" customizer__control-girls-params-clothing"><div class="customizer__control-girls-params-clothing-name" data-clothing="${clothingType}" > Вариант ${i} </div>;

        let j = 1;
        Object.entries(poseList).forEach(([pose, poseParams]) => {
          markup += `<li class="customizer__control-subitem ${vars.girlParamsPoseClass}" data-clothing="${clothingType}" data-pose="${pose}">
          <img src="${poseParams.preview}" alt="" />
          </li>`;
          j++;
        });

        markup += `</ul>`; // </div>
        i++;
      }
    );

    vars.customizerGirlsParamsDom.insertAdjacentHTML('beforeend', markup);
  }

  updateCustomizer() {
    // update Location list
    vars.customizerDom
      .querySelectorAll(`.${vars.locationClass}`)
      .forEach((element) => {
        element.classList.remove('active');
        if (element.dataset.location == this.config.scene.location) {
          element.classList.add('active');
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

    this.renderGirlParams();
    // Update Girls Pose List
    document
      .querySelectorAll(`.${vars.girlParamsPoseClass}`)
      .forEach((element) => {
        element.classList.remove('active');
        console.log('GIRL POSES UPDATE');

        if (
          element.dataset.clothing == this.config.clothing &&
          element.dataset.pose == this.config.pose
        ) {
          element.classList.add('active');
        }
      });

    // Change Bar icon
    document
      .querySelectorAll(`.${vars.customizerButtonClass}`)
      .forEach((button) => {
        if (button.dataset.bar != '') {
          const activeItemImage = document.querySelector(
            `.customizer__control-bar--${button.dataset.bar} .customizer__control-item.active img`
          );
          if (activeItemImage) {
            button.querySelector('img').src = activeItemImage.src;
          }
        }
      });

    //change Girl Pose Icon
    const girlParamsButtonImg =
      vars.customizerGirlsParamsButtonDom.querySelector('img');
    if (girlParamsButtonImg) {
      const activeGirlParamImg = document.querySelector(
        `.${vars.girlParamsPoseClass}.active img`
      );
      if (activeGirlParamImg) girlParamsButtonImg.src = activeGirlParamImg.src;
    }
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
    this.renderGirlParams();
    this.updateCustomizer();

    // events on click
    document.addEventListener('click', (e) => {
      // select car
      if (e.target.classList.contains(vars.carClass)) {
        this.customizerSwitchCar(e.target.dataset.cars);
        this.updateCustomizer();
        this.closeControlBars();
      }
      // select girl
      if (e.target.classList.contains(vars.girlClass)) {
        this.customizerSwitchGirl(e.target.dataset.girls);
        this.updateCustomizer();
        this.closeControlBars();
      }
      // click on girl
      if (e.target.classList.contains(vars.spriteGirlClass)) {
        this.customizerSwitchSpriteGirl(e.target.dataset.spritegirls);
        this.updateCustomizer();
        this.closeControlBars();
      }
      // select location
      if (e.target.classList.contains(vars.locationClass)) {
        this.customizerSwitchLocation(e.target.dataset.location);
        this.updateCustomizer();
        this.closeControlBars();
      }
      // click on pose
      if (e.target.classList.contains(vars.girlParamsPoseClass)) {
        this.customizerSwitchSpriteGirlPose(
          e.target.dataset.clothing,
          e.target.dataset.pose
        );
        this.updateCustomizer();
        // this.closeControlBars();
      }
    });

    vars.formInputCalendarCheckbox.checked = false; // uncheck checkbox on page load

    if (isIos()) {
      const screenshotSize4k = document.querySelector('.screenshot__size--4k');
      if (screenshotSize4k) {
        screenshotSize4k.classList.add(vars.hideOnIosClass);
      }

      if (vars.customizerGerenateButtonDom) {
        vars.customizerGerenateButtonDom.classList.add(vars.hideOnIosClass);
      }
    }
  }

  getModelName(modelType, modelId) {
    return this.objects[modelType][modelId].name;
  }
  getModelPreview(modelType, modelId) {
    return this.objects[modelType][modelId].preview;
  }

  showFullscreenButton() {
    if (document.fullscreenEnabled) {
      vars.fullscreenButtonDom.classList.remove('hidden');
    }
  }
}
