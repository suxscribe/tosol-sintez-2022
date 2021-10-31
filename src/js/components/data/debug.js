export let debugObject = {
  envMapIntensity: 1,
  exposure: 1,
  removeCar: () => {
    this.removeCar();
  },
  reloadCar: () => {
    this.removeCar();
    this.loadCar();
  },
};
