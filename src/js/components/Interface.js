// const customizerDom = document.querySelector('.customizer');
// const customizerLocationsDom = document.querySelector('.customizer__locations');
// const customizerCarsDom = document.querySelector('.customizer__cars');
// const customizerGirlsDom = document.querySelector('.customizer__girls');

// const carClass = 'customizer__car';
// const girlClass = 'customizer__girl';
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

    // Make Screenshot
    // document
    //   .querySelector('.customizer__screenshoter-make')
    //   .addEventListener('click', () => {
    //     this.takeScreenshot();
    //   });
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__screenshoter-make')) {
        const width = parseInt(e.target.dataset.width);
        const height = parseInt(e.target.dataset.height);

        console.log('screenshot' + width + 'x' + height);
        this.takeScreenshot(width, height);
      }
    });

    // Change car color
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('customizer__car-color')) {
        console.log('color' + e.target.dataset.color);
        this.updateMaterials.changeCarColor(e.target.dataset.color);
      }
    });

    // Change Car texture
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
        this.toggleButtons(true);
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
            this.toggleButtons(false);
          }
        }
      }
    });

    // Toggle calendar
    if (vars.customizerToggleCalendarDom) {
      vars.customizerToggleCalendarDom.addEventListener('click', () => {
        if (this.config.showCalendar === true) {
          this.config.showCalendar = false;
          vars.customizerToggleCalendarDom.classList.remove('active');
        } else {
          this.config.showCalendar = true;
          vars.customizerToggleCalendarDom.classList.add('active');
        }
        console.log(this.config.showCalendar);
        this.world.toggleCalendar();
        this.debugObject.needsToggleCalendar = true;
      });
    }

    // FORM SEND
    vars.formDom.addEventListener('submit', this.formSend);
  }

  async formSend(e) {
    e.preventDefault();

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
      console.log(result.message);
      vars.formDom.reset();
      vars.formDom.classList.add('send');
    } else {
    }
  }

  toggleButtons(show) {
    if (show) {
      vars.customizerButtonsDom.classList.remove('hidden');
    } else {
      vars.customizerButtonsDom.classList.add('hidden');
    }
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

    if (this.config.spritegirl == 'girl0') {
      console.log(this.config.spritegirl);

      vars.customizerGirlsParamsButton.classList.add('hidden');
    } else {
      vars.customizerGirlsParamsButton.classList.remove('hidden');
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
        <ul class="customizer__girls-param-pose-list">`;

        let j = 1;
        Object.entries(poseList).forEach(([pose, poseParams]) => {
          markup += `<li class="customizer__control-item ${vars.girlParamsPoseClass}" data-clothing="${clothingType}" data-pose="${pose}">Поза ${j}</li>`;
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
      // click on pose
      if (e.target.classList.contains(vars.girlParamsPoseClass)) {
        this.customizerSwitchSpriteGirlPose(
          e.target.dataset.clothing,
          e.target.dataset.pose
        );
        this.updateCustomizer();
      }
    });
  }

  /* 
  Screenshots
  */
  takeScreenshot(screenshotWidth, screenshotHeight) {
    this.config.screenshotSize = {
      width: screenshotWidth,
      height: screenshotHeight,
    };

    this.debugObject.needsScreenshot = true;
    this.debugObject.needsUpdate = true;
  }

  saveAsImage() {
    let imgData;
    let strDownloadMime = 'image/octet-stream';

    try {
      let strMime = 'image/jpeg';
      imgData = this.renderer.domElement.toDataURL(strMime);

      const fileData = {
        image: imgData,
      };
      this.sendToServer(fileData);
      // this.saveFile(imgData.replace(strMime, strDownloadMime), 'test.jpg');
      this.debugObject.needsUpdate = true; // render with original size after resize
    } catch (e) {
      console.log(e);
      return;
    }
  }

  sendToServer(data) {
    console.log(data);

    fetch(this.api + '?c=save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      //.then(res => res.text())
      .then((response) => {
        console.log(response);
        document
          .querySelector('.customizer__screenshoter-link1')
          .setAttribute('href', response.name);
        document.querySelector('.customizer__screenshoter-link1').innerHTML =
          response.name;

        document
          .querySelector('.customizer__screenshoter-link2')
          .setAttribute('href', 'script.php?c=view&image=' + response.tm);
        document.querySelector('.customizer__screenshoter-link2').innerHTML =
          'Открыть страницу';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveFile(strData, filename) {
    vars.screenshotHolderDom.src = strData;

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
