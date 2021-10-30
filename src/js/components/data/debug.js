export let debugObject = {
  envMapIntensity: 1,
  removeCar: () => {
    this.removeCar();
  },
  reloadCar: () => {
    this.removeCar();
    this.loadCar();
  },
};
