import { vars, objectsData, customizerData, debugObject } from './data/vars';
import { isIos } from './Utils';

export default class Screenshot {
  constructor(_options) {
    this.config = _options.config;
    this.renderer = _options.renderer;

    this.debugObject = debugObject;
    this.api = 'script.php';
  }

  /* 
  Screenshots
  */
  takeScreenshot(type, screenshotWidth = null, screenshotHeight = null) {
    // Set max screenshot size for IOS. Otherwise Safari will crash and burn

    // else {
    //   this.config.screenshotSize.width = screenshotWidth;
    //   this.config.screenshotSize.height = screenshotHeight;
    // }

    this.config.screenshotType = type;

    // if (type == 'preview') {
    //   this.config.screenshotSize.width =
    //     this.debugObject.screenshotSizes.preview.width;
    //   this.config.screenshotSize.height =
    //     this.debugObject.screenshotSizes.preview.height;
    // } // this will override selected screenshot sizes resulting in wrong screenshot size.

    if (type == 'share') {
      this.config.screenshotSize.width =
        this.debugObject.screenshotSizes.share.width;
      this.config.screenshotSize.height =
        this.debugObject.screenshotSizes.share.height;

      this.config.showLogoSprite = true;
      // hide calendar
      vars.formInputCalendarCheckbox.checked = false;
      this.config.showCalendar = false;
    }

    if (type == 'download') {
      this.config.showLogoSprite = true;
    }
    if (type == 'gift') {
      if (isIos()) {
        this.config.screenshotSize.width =
          this.debugObject.screenshotSizes.ios.width;
        this.config.screenshotSize.height =
          this.debugObject.screenshotSizes.ios.height;
      } else {
        this.config.screenshotSize.width =
          this.debugObject.screenshotSizes.gift.width;
        this.config.screenshotSize.height =
          this.debugObject.screenshotSizes.gift.height;
      }
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
        vars.screenshotMime,
        0.8
      );

      // todo clear screenshotFileData & screenshotImageData after being used and send
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
    // todo uncomment
    // console.log(data);
    fetch(this.api + '?c=save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(this.screenshotFileData),
    })
      .then((res) => res.json())
      .then((response) => {
        // console.log(response);
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

    //clear data
    this.screenshotFileData = null;
    this.screenshotImageData = null;
  }

  showScreenshotPreview() {
    // todo set each preview independent. pass parameter to this method
    // todo remove preview image src after popup is closed
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
