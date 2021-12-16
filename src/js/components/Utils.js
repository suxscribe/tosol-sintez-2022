export const isEmptyObject = (object) => {
  return (
    object && // 👈 null and undefined check
    Object.keys(object).length === 0 &&
    Object.getPrototypeOf(object) === Object.prototype
  );
};

// DETECT IOS
export const isIos = () => {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};
