export default class StringUtils {

  static isEmpty (str) {

    if (str == null || str === '' || str === void 0) {
      return true;
    }
    return false;
  }
}

