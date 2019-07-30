// type AlertType = 'info' | 'warn' | 'error' | 'success'

export class AlertHelper {
  static dropDown;
  static onClose;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }
  static getDropDown() {
    return this.dropDown;
  }

  // static getAlertType() {
  //   return this.AlertType;
  // }

  static showDropAlert(type, title, message) {
    try {
      if (this.dropDown) {
        this.dropDown.alertWithType(type, title, message);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  static setOnClose(onClose) {
    this.onClose = onClose;
  }

  static invokeOnClose() {
    if (typeof this.onClose === "function") {
      this.onClose();
    }
  }
}
