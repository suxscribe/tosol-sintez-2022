import tippy from 'tippy.js';
import MicroModal from 'micromodal';

import { vars, objectsData, customizerData, debugObject } from './data/vars';
import { doc } from 'prettier';

export default class Interface {
  constructor(_options) {
    this.config = _options.config;
    this.world = _options.world;
    this.renderer = _options.renderer;
    this.updateMaterials = _options.updateMaterials;

    this.api = 'script.php';

    this.objects = objectsData; // Models data
    this.debugObject = debugObject;
    this.customizer = customizerData; // Objects sets available for each scene \ location

    this.setEvents();
    this.renderCustomizer();

    tippy('[data-tippy-content]', {
      placement: 'right',
      arrow: false,
      offset: [0, 20],
    });
  }

  setEvents() {
    MicroModal.init({
      openTrigger: 'data-micromodal-open',
      closeTrigger: 'data-micromodal-close',
      openClass: 'is-open',
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
    });

    // Make Screenshot
    // document
    //   .querySelector('.customizer__screenshoter-make')
    //   .addEventListener('click', () => {
    //     this.takeScreenshot();
    //   });
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__screenshoter-download')) {
        const width = parseInt(e.target.dataset.width);
        const height = parseInt(e.target.dataset.height);

        // console.log('screenshot' + width + 'x' + height);
        this.takeScreenshot(width, height, 'download');
      }

      // open share modal and make preview screenshot
      if (
        e.target.classList.contains('customizer__share-button') ||
        e.target.closest('.customizer__share-button')
      ) {
        this.takeScreenshot(
          this.config.screenshotSize.width,
          this.config.screenshotSize.height,
          'share'
        );
      }

      // open gift modal and make screenshot
      if (e.target.classList.contains('customizer__gift')) {
        // this.config.screenshotSize.width =
        //   this.debugObject.giftScreenshotSize.width;
        // this.config.screenshotSize.height =
        //   this.debugObject.giftScreenshotSize.height;

        this.takeScreenshot(
          this.debugObject.giftScreenshotSize.width,
          this.debugObject.giftScreenshotSize.height,
          'gift'
        );
      }
    });

    // Change car color
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__car-color')) {
        console.log('color' + e.target.dataset.color);
        this.updateMaterials.changeCarColor(e.target.dataset.color);

        vars.customizerCarColorsElements.forEach((element) => {
          element.classList.remove('active');
        });
        e.target.classList.add('active');
      }

      // Change Car texture
      if (e.target.classList.contains('customizer__car-texture')) {
        console.log('texture');
        this.updateMaterials.changeCarTexture();
      }

      // Generate Custom Car & Girl Set
      if (e.target.classList.contains('customizer__generate-button')) {
        console.log('random');

        // select random car - store to config
        const propCar = this.getRandomProp(objectsData.cars);
        this.customizerSwitchCar(propCar);
        // this.setToConfig('car', prop);
        // this.reloadCar();

        // select random sprite girl - store to config
        const propSpriteGirl = this.getRandomProp(
          objectsData.spritegirls,
          true
        );
        console.log(propSpriteGirl);

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
          console.log(propSpriteGirlClothing);
          console.log(propSpriteGirlPose);
        }

        this.customizerSwitchSpriteGirlPose(
          propSpriteGirlClothing,
          propSpriteGirlPose
        );

        // select random color
        vars.customizerCarColorsElements[
          Math.floor(Math.random() * vars.customizerCarColorsElements.length)
        ].click();
        // todo update car color after car was loaded
        // todo select random color - store to config (! add config parameter)
      }
    });

    // close control bar
    document.addEventListener('click', (e) => {
      if (
        e.target.closest('.customizer__control-bar-close') ||
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
            this.toggleButtons(false);
          }
        }
      }
    });

    // Toggle calendar button // todo remove this
    // if (vars.customizerToggleCalendarDom) {
    //   vars.customizerToggleCalendarDom.addEventListener('click', () => {
    //     if (this.config.showCalendar === true) {
    //       this.config.showCalendar = false;
    //       vars.customizerToggleCalendarDom.classList.remove('active');
    //     } else {
    //       this.config.showCalendar = true;
    //       vars.customizerToggleCalendarDom.classList.add('active');
    //     }
    //     console.log(this.config.showCalendar);
    //     this.world.toggleCalendar();
    //     this.debugObject.needsToggleCalendar = true;
    //   });
    // }

    // FORM SEND
    vars.formDom.addEventListener('submit', this.formSend);

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__fullscreen')) {
        console.log('fullscreenEnabled', document.fullscreenEnabled); // can enter fullscreen?

        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.fullscreenEnabled) {
            document.exitFullscreen();
          }
        }
      }
    });
  }

  getRandomProp(object, plusOne = null) {
    console.log('getRandomProp', object);

    const keys = Object.keys(object);
    if (plusOne) {
      return keys[Math.floor(Math.random() * (keys.length - 1) + 1)];
    } else {
      return keys[Math.floor(Math.random() * keys.length)];
    }
  }

  async formSend(e) {
    e.preventDefault();

    if (vars.formGiftCodeInputDom.value === vars.formGiftCodeMatch) {
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
    this.toggleButtons(true);
  }

  toggleButtons(show) {
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
      console.log(this.config.spritegirl);

      if (vars.customizerGirlsParamsButton) {
        vars.customizerGirlsParamsButton.classList.add('hidden');
      }
    } else {
      if (vars.customizerGirlsParamsButton) {
        vars.customizerGirlsParamsButton.classList.remove('hidden');
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
  getModelPreview(modelType, modelId) {
    return this.objects[modelType][modelId].preview;
  }

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
    const girl = 'girl1';
    let markup = '';

    vars.customizerGirlsParamsDom.innerHTML = '';

    let i = 1;
    Object.entries(objectsData.spritegirls[girl].clothing).forEach(
      ([clothingType, poseList]) => {
        markup += `<div class=" customizer__girls-param-clothing">
        <div class="customizer__girls-param-clothing-name" data-clothing="${clothingType}">Вариант ${i}</div>
        <ul class="customizer__girls-param-sublist customizer__girls-param-pose-list">`;

        let j = 1;
        Object.entries(poseList).forEach(([pose, poseParams]) => {
          markup += `<li class="customizer__control-subitem ${vars.girlParamsPoseClass}" data-clothing="${clothingType}" data-pose="${pose}">Поза ${j}</li>`;
          j++;
        });

        markup += `</ul></div>`;
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

    // Update Girls Pose List
    vars.customizerDom
      .querySelectorAll(`.${vars.girlParamsPoseClass}`)
      .forEach((element) => {
        element.classList.remove('active');

        if (
          element.dataset.clothing == this.config.clothing &&
          element.dataset.pose == this.config.pose
        ) {
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
    this.renderGirlParams();
    this.updateCustomizer();

    // events on click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains(vars.carClass)) {
        this.customizerSwitchCar(e.target.dataset.cars);
        this.updateCustomizer();
        this.closeControlBars();
      }
      if (e.target.classList.contains(vars.girlClass)) {
        this.customizerSwitchGirl(e.target.dataset.girls);
        this.updateCustomizer();
        this.closeControlBars();
      }
      if (e.target.classList.contains(vars.spriteGirlClass)) {
        this.customizerSwitchSpriteGirl(e.target.dataset.spritegirls);
        this.updateCustomizer();
        this.closeControlBars();
      }
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
        this.closeControlBars();
      }
    });
  }

  /* 
  Screenshots
  */
  takeScreenshot(screenshotWidth, screenshotHeight, type) {
    this.config.screenshotSize = {
      width: screenshotWidth,
      height: screenshotHeight,
    };
    this.config.screenshotType = type;

    if (type == 'share') {
      this.config.showLogoSprite = true;
      // hide calendar
      vars.formInputCalendarCheckbox.checked = false;
      this.config.showCalendar = false;
    }
    if (type == 'download') {
      this.config.showLogoSprite = true;
      if (vars.formInputCalendarCheckbox.checked == true) {
        this.config.showCalendar = true;
        // console.log('screen with calendar');
      } else {
        this.config.showCalendar = false;
      }
    }
    if (type == 'gift') {
      // hide logo
      this.config.showLogoSprite = false;
      // hide calendar
      vars.formInputCalendarCheckbox.checked = false;
      this.config.showCalendar = false;
    }

    this.debugObject.needsScreenshot = true;
    this.debugObject.needsUpdate = true;
  }

  saveAsImage() {
    // let screenshotImageData;

    try {
      this.screenshotImageData = this.renderer.domElement.toDataURL(
        vars.screenshotMime
      );

      this.screenshotFileData = {
        image: this.screenshotImageData,
      };

      if (this.config.screenshotType == 'preview') {
        this.showScreenshotPreview();
      }
      if (this.config.screenshotType == 'share') {
        this.showScreenshotPreview();
        this.sendScreenshotToServer();
      }
      if (this.config.screenshotType == 'download') {
        this.showScreenshotPreview();
        this.startScreenshotDownload();
      }
      if (this.config.screenshotType == 'gift') {
        this.showScreenshotPreview();
        this.sendScreenshotToServer();
      }
      this.debugObject.needsUpdate = true; // render with original size after resize
    } catch (e) {
      console.log(e);
      return;
    }
  }

  sendScreenshotToServer() {
    // console.log(data);

    fetch(this.api + '?c=save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(this.screenshotFileData),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);

        // Update Share links
        this.screenShotUrl = vars.screenshotUrlPart + response.tm;

        document
          .querySelector('.socials__social--facebook')
          .setAttribute(
            'href',
            'https://www.facebook.com/sharer/sharer.php?u=' + this.screenShotUrl
          );

        document
          .querySelector('.socials__social--vk')
          .setAttribute(
            'href',
            'https://vk.com/share.php?url=' + this.screenShotUrl
          );

        document
          .querySelector('.socials__social--twitter')
          .setAttribute(
            'href',
            'http://twitter.com/share?url=' + this.screenShotUrl
          );

        document
          .querySelector('.socials__social--ok')
          .setAttribute(
            'href',
            'https://connect.ok.ru/offer?url=' + this.screenShotUrl
          );

        // vars.screenshoterLinkImageDom.setAttribute('href', response.name);
        // vars.screenshoterLinkImageDom.innerHTML = 'Открыть скриншот';

        vars.screenshoterLinkPageDom.setAttribute(
          'href',
          vars.screenshotUrlPart + response.tm
        );
        vars.screenshoterLinkPageDom.innerHTML = 'Открыть страницу';

        // Add screenshot URL to form
        vars.formInputScreenshotDom.value = vars.domain + response.name;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showScreenshotPreview() {
    vars.screenshotHolderDownloadDom.src = this.screenshotImageData; // Show Screenshot preview
    vars.screenshotHolderShareDom.src = this.screenshotImageData; // Show Screenshot preview
    vars.screenshotHolderGiftDom.src = this.screenshotImageData; // Show Screenshot preview
  }

  startScreenshotDownload() {
    let strDownloadMime = 'image/octet-stream';

    const screenshotDownloadData = this.screenshotImageData.replace(
      vars.strMime,
      strDownloadMime
    );
    let link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = 'ts-2022-screenshot.jpg';
      link.href = screenshotDownloadData;
      link.click();
      document.body.removeChild(link); //remove the link when done
    } else {
      location.replace(uri);
    }
  }
}
