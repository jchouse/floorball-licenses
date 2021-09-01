/**
 * DatePicker
 *
 * @param {boolean} [disabled]
 */
export default class DateFormatter {
  static dateForUi(date) {
    const dateObj = new Date(date);
    const day = (`00${dateObj.getDate()}`).slice(-2);
    const month = (`00${dateObj.getMonth() + 1}`).slice(-2);

    return `${day}.${month}.${dateObj.getFullYear()}`;
  }
}
