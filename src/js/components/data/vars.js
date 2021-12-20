import * as THREE from 'three';

export const vars = {
  domain: 'https://constructor.ts-2022.ru/',
  canvasClass: 'webgl',

  modalGiftId: 'modal-gift',
  modalSentId: 'modal-sent',

  screenshotSizeClass: 'screenshot__size',
  screenshotDownloadButtonClass: 'screenshot__download-button',
  customizerButtonClass: 'customizer__control-button',
  customizerControlBarClass: 'customizer__control-bar',
  customizerControlBarCloseClass: 'customizer__control-bar-close',
  locationClass: 'customizer__locations-item',
  carClass: 'customizer__cars-item',
  carColorClass: 'customizer__car-color',
  girlClass: 'customizer__girls-item',
  spriteGirlClass: 'customizer__sprite-girls-item',
  girlParamsPoseClass: 'customizer__girls-pose-item',
  customizerGirsParamsButtonClass: 'customizer__control-girls-params-button',
  hideOnIosClass: 'hide-on-ios',
  modalTabClass: 'modal__tab',
  modalTabButtonClass: 'modal__tab-next-button',
  visibleClass: 'visible',

  customizerDom: document.querySelector('.customizer'),
  customizerButtonsDom: document.querySelector('.customizer__control-buttons'),
  customizerLocationsDom: document.querySelector('.customizer__locations'),
  customizerCarsDom: document.querySelector('.customizer__cars'),
  customizerGirlsDom: document.querySelector('.customizer__girls'),
  customizerSpriteGirlsDom: document.querySelector('.customizer__sprite-girls'),
  customizerGirlsParamsButtonDom: document.querySelector(
    `.customizer__control-girls-params-button`
  ),
  customizerGirlsParamsDom: document.querySelector(
    '.customizer__control-girls-params-bar'
  ),
  customizerToggleCalendarDom: document.querySelector(
    '.customizer__toggle-calendar'
  ),

  customizerGirlsParamsControlWrap: document.querySelector(
    '.customizer__control-girls-params-wrap'
  ),
  customizerGerenateButtonDom: document.querySelector(
    '.customizer__generate-button'
  ),
  customizerCarColorsDom: document.querySelector('.customizer__control-colors'),
  customizerSpriteGirlsSubbarDom: document.querySelector(
    '.customizer__control-girls-params-bar'
  ),
  customizerModalTabs: document.querySelectorAll(`.modal__tab`),

  fullscreenButtonDom: document.querySelector('.customizer__fullscreen'),
  overlayRotateDom: document.querySelector('.overlay-rotate'),

  screenshoterLinkImageDom: document.querySelector(
    '.screenshot__helper-link--1'
  ),
  screenshoterLinkPageDom: document.querySelector(
    '.screenshot__helper-link--2'
  ),
  screenshotHolderDownloadDom: document.querySelector(
    '.screenshot__holder--download'
  ),
  screenshotHolderShareDom: document.querySelector(
    '.screenshot__holder--share'
  ),
  screenshotHolderGiftDom: document.querySelector('.screenshot__holder--gift'),

  preloaderProgressDom: document.querySelector('.preloader__progress'),

  formDom: document.querySelector('#form-gift'),
  formInputScreenshotDom: document.querySelector('#form-screenshot'),
  formInputCalendarCheckbox: document.querySelector('#screenshot-calendar'),
  formGiftCodeInputDom: document.querySelector('#form-code'),
  formGiftCodeMatch: 'CUSTOM',

  screenshotUrlPart: 'https://constructor.ts-2022.ru/script.php?c=view&image=',
  screenshotMime: 'image/jpeg',
  spriteGirlShift: 0.3,
  carColors: [
    ['#d90e3e', '#e00909'],
    ['#d9870e', '#a7690d'],
    ['#059b1d', '#037916'],
    ['#09682f', '#075024'],
    ['#0596c3', '#016787'],
    ['#1d307c', '#07144b'],
    ['#555555', '#252530'],
    ['#000000', '#000000'],
  ], // label color, material color
};

export const objectsData = {
  locations: {
    studio: {
      name: 'Studio',
      source: '/assets/models/loc-studio.glb',
      preview: '/assets/images/previews/loc-studio.jpg',
      position: new THREE.Vector3(-1.7, -0.02, 1.8),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    track: {
      name: 'Studio 2',
      source: '/assets/models/loc-studio-mono-2.glb',
      preview: '/assets/images/previews/loc-studio-mono.jpg',
      position: new THREE.Vector3(-1.7, -0.02, 1.8),
      scale: new THREE.Vector3(3.5, 3.5, 3.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    dark: {
      name: 'Dark',
      source: '/assets/models/loc-studio-dark.glb',
      preview: '/assets/images/previews/loc-studio-dark.jpg',
      position: new THREE.Vector3(4.8, -0.1, 2),
      scale: new THREE.Vector3(4.5, 4.5, 4.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    beach: {
      name: 'Beach',
      source: '/assets/models/loc-beach.glb',
      preview: '/assets/images/previews/loc-beach.jpg',
      position: new THREE.Vector3(-0.81, -0.1, -1.85),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    city: {
      name: 'City',
      source: '/assets/models/loc-city-2.glb',
      preview: '/assets/images/previews/loc-city.jpg',
      position: new THREE.Vector3(-0.81, -0.1, -1.85),
      scale: new THREE.Vector3(2.8, 2.8, 2.8),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    hills: {
      name: 'Hills',
      source: '/assets/models/loc-hills.glb',
      preview: '/assets/images/previews/loc-hills.jpg',
      position: new THREE.Vector3(-0.81, -0.1, -1.85),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    night: {
      name: 'night',
      source: '/assets/models/loc-night.glb',
      preview: '/assets/images/previews/loc-night.jpg',
      position: new THREE.Vector3(-0.81, -0.1, -1.85),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
    sunset: {
      name: 'sunset',
      source: '/assets/models/loc-sunset.glb',
      preview: '/assets/images/previews/loc-sunset.jpg',
      position: new THREE.Vector3(-0.81, -0.1, -1.85),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
      envMapSource: '/assets/envMaps/bw/',
      envMapType: 'cube',
    },
  },
  cars: {
    porsche: {
      name: 'Porsche',
      source: '/assets/models/porsche-2.glb',
      preview: '/assets/images/previews/car-porsche.png',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(0.029, 0.029, 0.029),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    ferrari: {
      name: 'Ferrari',
      source: '/assets/models/ferrari-03.glb',
      preview: '/assets/images/previews/car-ferrari.png',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    lamborgini: {
      name: 'Lamborgini',
      source: '/assets/models/lamborgini-17.glb',
      preview: '/assets/images/previews/car-lamborgini.png',
      position: new THREE.Vector3(0, 0.0, 0),
      scale: new THREE.Vector3(0.3, 0.3, 0.3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    challenger: {
      name: 'Challenger',
      source: '/assets/models/challenger-2.glb',
      preview: '/assets/images/previews/car-challenger.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    camaro: {
      name: 'Camaro',
      source: '/assets/models/camaro.glb',
      preview: '/assets/images/previews/car-camaro.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    mercedes: {
      name: 'Mercedes',
      source: '/assets/models/mercedes.glb',
      preview: '/assets/images/previews/car-mercedes.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    bmw: {
      name: 'BMW',
      source: '/assets/models/bmw.glb',
      preview: '/assets/images/previews/car-x5.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    ram: {
      name: 'ram',
      source: '/assets/models/ram.glb',
      preview: '/assets/images/previews/car-ram.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    f100: {
      name: 'f100',
      source: '/assets/models/f100.glb',
      preview: '/assets/images/previews/car-f100.jpg',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  },

  spritegirls: {
    girl0: {
      name: 'Без девушки',
      source: '', // leave empty to skip loading texture
      preview: '/assets/images/previews/girl0.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.05, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {},
    },
    girl1: {
      name: 'Girl 1',
      source: '/assets/images/previews/girl1.png',
      preview: '/assets/images/previews/girl1.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.1, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {
        clothing1: {
          pose1: {
            source: '/assets/textures/girl1/girl-1-1.webp',
            sourceFallback: '/assets/textures/girl1/girl-1-1.png',
            preview: '/assets/images/previews/girl1/girl-1-1-preview.png',
          },
          pose2: {
            source: '/assets/textures/girl1/girl-1-2.webp',
            sourceFallback: '/assets/textures/girl1/girl-1-2.png',
            preview: '/assets/images/previews/girl1/girl-1-2-preview.png',
          },
          pose3: {
            source: '/assets/textures/girl1/girl-1-3.webp',
            sourceFallback: '/assets/textures/girl1/girl-1-3.png',
            preview: '/assets/images/previews/girl1/girl-1-3-preview.png',
          },
        },
        clothing2: {
          pose1: {
            source: '/assets/textures/girl1/girl-2-1.webp',
            sourceFallback: '/assets/textures/girl1/girl-2-1.png',
            preview: '/assets/images/previews/girl1/girl-2-1-preview.png',
          },
          pose2: {
            source: '/assets/textures/girl1/girl-2-2.webp',
            sourceFallback: '/assets/textures/girl1/girl-2-2.png',
            preview: '/assets/images/previews/girl1/girl-2-2-preview.png',
          },
          pose3: {
            source: '/assets/textures/girl1/girl-2-3.webp',
            sourceFallback: '/assets/textures/girl1/girl-2-3.png',
            preview: '/assets/images/previews/girl1/girl-2-3-preview.png',
          },
        },
        clothing3: {
          pose1: {
            source: '/assets/textures/girl1/girl-3-1.webp',
            sourceFallback: '/assets/textures/girl1/girl-3-1.png',
            preview: '/assets/images/previews/girl1/girl-3-1-preview.png',
          },
          pose2: {
            source: '/assets/textures/girl1/girl-3-2.webp',
            sourceFallback: '/assets/textures/girl1/girl-3-2.png',
            preview: '/assets/images/previews/girl1/girl-3-2-preview.png',
          },
          pose3: {
            source: '/assets/textures/girl1/girl-3-3.webp',
            sourceFallback: '/assets/textures/girl1/girl-3-3.png',
            preview: '/assets/images/previews/girl1/girl-3-3-preview.png',
          },
        },
      },
    },
    girl2: {
      name: 'Girl2',
      source: '/assets/images/previews/girl2.png', // leave empty to skip loading texture
      preview: '/assets/images/previews/girl2.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.1, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {
        clothing1: {
          pose1: {
            source: '/assets/textures/girl2/girl-1-1.webp',
            sourceFallback: '/assets/textures/girl2/girl-1-1.png',
            preview: '/assets/images/previews/girl2/girl-1-1-preview.png',
          },
          pose2: {
            source: '/assets/textures/girl2/girl-1-2.webp',
            sourceFallback: '/assets/textures/girl2/girl-1-2.png',
            preview: '/assets/images/previews/girl2/girl-1-2-preview.png',
          },
          pose3: {
            source: '/assets/textures/girl2/girl-1-3.webp',
            sourceFallback: '/assets/textures/girl2/girl-1-3.png',
            preview: '/assets/images/previews/girl2/girl-1-3-preview.png',
          },
        },
        clothing2: {
          pose1: {
            source: '/assets/textures/girl2/girl-2-1.webp',
            sourceFallback: '/assets/textures/girl2/girl-2-1.png',
            preview: '/assets/images/previews/girl2/girl-2-1-preview.png',
          },
          pose2: {
            source: '/assets/textures/girl2/girl-2-2.webp',
            sourceFallback: '/assets/textures/girl2/girl-2-2.png',
            preview: '/assets/images/previews/girl2/girl-2-2-preview.png',
          },
          pose3: {
            source: '/assets/textures/girl2/girl-2-3.webp',
            sourceFallback: '/assets/textures/girl2/girl-2-3.png',
            preview: '/assets/images/previews/girl2/girl-2-3-preview.png',
          },
        },
        clothing3: {
          pose1: {
            source: '/assets/textures/girl2/girl-3-1.webp',
            sourceFallback: '/assets/textures/girl2/girl-3-1.png',
            preview: '/assets/images/previews/girl2/girl-3-1-preview.png',
          },
          pose2: {
            source: '/assets/textures/girl2/girl-3-2.webp',
            sourceFallback: '/assets/textures/girl2/girl-3-2.png',
            preview: '/assets/images/previews/girl2/girl-3-2-preview.png',
          },
          pose3: {
            source: '/assets/textures/girl2/girl-3-3.webp',
            sourceFallback: '/assets/textures/girl2/girl-3-3.png',
            preview: '/assets/images/previews/girl2/girl-3-3-preview.png',
          },
        },
      },
    },
    girl3: {
      name: 'Girl 3',
      source: '/assets/images/previews/girl3.png', // leave empty to skip loading texture
      preview: '/assets/images/previews/girl3.png',
      center: new THREE.Vector2(0.5, 0.5),
      position: new THREE.Vector3(0.8, -0.2, -3),
      scale: new THREE.Vector3(1, 1, 1),
      clothing: {
        clothing1: {
          pose1: {
            source: '/assets/textures/girl3/girl-1-1.webp',
            sourceFallback: '/assets/textures/girl3/girl-1-1.png',
            preview: '/assets/images/previews/girl3/girl-1-1.png',
          },
          pose2: {
            source: '/assets/textures/girl3/girl-1-2.webp',
            sourceFallback: '/assets/textures/girl3/girl-1-2.png',
            preview: '/assets/images/previews/girl3/girl-1-2.png',
          },
          pose3: {
            source: '/assets/textures/girl3/girl-1-3.webp',
            sourceFallback: '/assets/textures/girl3/girl-1-3.png',
            preview: '/assets/images/previews/girl3/girl-1-3.png',
          },
        },
        clothing2: {
          pose1: {
            source: '/assets/textures/girl3/girl-2-1.webp',
            sourceFallback: '/assets/textures/girl3/girl-2-1.png',
            preview: '/assets/images/previews/girl3/girl-2-1.png',
          },
          pose2: {
            source: '/assets/textures/girl3/girl-2-2.webp',
            sourceFallback: '/assets/textures/girl3/girl-2-2.png',
            preview: '/assets/images/previews/girl3/girl-2-2.png',
          },
          pose3: {
            source: '/assets/textures/girl3/girl-2-3.webp',
            sourceFallback: '/assets/textures/girl3/girl-2-3.png',
            preview: '/assets/images/previews/girl3/girl-2-3.png',
          },
        },
        clothing3: {
          pose1: {
            source: '/assets/textures/girl3/girl-3-1.webp',
            sourceFallback: '/assets/textures/girl3/girl-3-1.png',
            preview: '/assets/images/previews/girl3/girl-3-1.png',
          },
          pose2: {
            source: '/assets/textures/girl3/girl-3-2.webp',
            sourceFallback: '/assets/textures/girl3/girl-3-2.png',
            preview: '/assets/images/previews/girl3/girl-3-2.png',
          },
          pose3: {
            source: '/assets/textures/girl3/girl-3-3.webp',
            sourceFallback: '/assets/textures/girl3/girl-3-3.png',
            preview: '/assets/images/previews/girl3/girl-3-3.png',
          },
        },
      },
    },
  },
  calendar: {
    name: 'Calendar',
    source: '/assets/textures/calendar.png',
    preview: '',
    center: new THREE.Vector2(1, 0.5),
    position: new THREE.Vector3(0.0, 0.0, 1),
    scale: undefined,
    isOrtho: true,
    align: 'right',
  },
  logo: {
    name: 'Logo',
    source: '/assets/textures/felix_graphic.png',
    preview: '',
    center: new THREE.Vector2(0, 0.5),
    position: new THREE.Vector3(0.0, 0.0, 1),
    scale: undefined,
    isOrtho: true,
    align: 'left',
  },
  grain: {
    name: 'Grain',
    source: '/assets/textures/grain-background-2.png',
    preview: '',
    center: new THREE.Vector2(0.5, 0.5),
    position: new THREE.Vector3(0, 0, -0.65),
    scale: new THREE.Vector3(1, 1, 1),
    repeat: true,
  },
};

export const customizerDefaultSet = {
  cars: [
    'lamborgini',
    'porsche',
    'ferrari',
    'challenger',
    'camaro',
    'mercedes',
    'bmw',
    'ram',
    'f100',
  ],
  spritegirls: ['girl0', 'girl1', 'girl2', 'girl3'],
};

export const customizerData = {
  night: {
    name: 'night',
    location: 'night',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  studio: {
    name: 'Студия',
    location: 'studio',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  track: {
    name: 'Пустая',
    location: 'track',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  dark: {
    name: 'Dark',
    location: 'dark',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  beach: {
    name: 'Beach',
    location: 'beach',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  city: {
    name: 'City',
    location: 'city',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  hills: {
    name: 'Hills',
    location: 'hills',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
  sunset: {
    name: 'sunset',
    location: 'sunset',
    cars: customizerDefaultSet.cars,
    girls: ['girl1', 'girl2', 'girl3', 'helmet'],
    spritegirls: customizerDefaultSet.spritegirls,
  },
};

export let debugObject = {
  needsUpdate: false,
  envMapIntensity: 1.2,
  exposure: 1,
  pixelRatio: Math.min(Math.max(window.devicePixelRatio, 2), 1),
  cameraInitMovementCompleted: false,
  firstLoadCompleted: false,
  needsToggleCalendar: false,
  selects: [],
  carPaintMaterials: ['paint', 'CarPaint', 'carpaint'],
  excludedMaterials: [
    'TIRE1.1',
    'TIRE1.2',
    'Tire_',
    'WallRight.1',
    'WallLeft.1',
    'WallBack.1',
    'Pipes2.1',
    'RimsColor_',
    'RimsColor',
    'plane_01',
    'plane_02',
    'plane_03',
    'plane_04',
    'BG',
    'disk',
    'brake',
    'World',
    'Wheel',
    'studio_06.1',
    'studio_06.2',
  ],
  screenshotSizes: {
    gift: {
      width: 3840,
      height: 2160,
    },
    ios: {
      width: 1920,
      height: 1080,
    },
    share: {
      width: 1366,
      height: 768,
    },
    preview: {
      width: 1366,
      height: 768,
    },
  },
  includedMaterials: ['paint', 'CarPaint', 'CarPaint_'],
  shadowMaterials: ['shadow', 'watter', 'Shadow_', 'Shadow'],
  bloomIntensity: 0,
  showStats: false,
  showDebug: window.location.hash === '#debug',
};

/* 
girls: {
    girl1: {
      name: 'Girl 1',
      source: '/assets/models/girl1.glb',
      preview: '',
      position: new THREE.Vector3(5, 0, 6),
      scale: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    girl2: {
      name: 'Girl 2',
      source: '/assets/models/girl2.glb',
      preview: '',
      position: new THREE.Vector3(5, 0, 6),
      scale: new THREE.Vector3(4, 4, 4),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    girl3: {
      name: 'Girl 3',
      source: '/assets/models/girl3.glb',
      preview: '',
      position: new THREE.Vector3(5, 0.5, 6),
      scale: new THREE.Vector3(3, 3, 3),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    helmet: {
      name: 'Helmet',
      source: '/assets/models/helmet/DamagedHelmet.gltf',
      preview: '',
      position: new THREE.Vector3(5, 3, 9.5),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
    empty: {
      name: 'Empty',
      source: '/assets/models/empty.glb',
      preview: '',
      position: new THREE.Vector3(5, 3, 9.5),
      scale: new THREE.Vector3(2.5, 2.5, 2.5),
      rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
    },
  }, */
