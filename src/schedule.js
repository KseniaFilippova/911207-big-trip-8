import Component from './component';
import moment from 'moment';

const compareByEvent = (a, b) => a.start - b.start;

export default class Schedule extends Component {
  constructor(data) {
    super();
    this._tripPointsInfo = data;
  }

  get _tripPointsCities() {
    const citiesArr = this._tripPointsInfo.sort(compareByEvent).map((tripPointInfo) => tripPointInfo.city);

    if (citiesArr.length === 0) {
      return `No trip points`;
    } else if (citiesArr.length === 1) {
      return `${citiesArr[0]}`;
    }

    const startCity = citiesArr[0];
    const endCity = citiesArr[citiesArr.length - 1];

    if (startCity === endCity) {
      return startCity;
    }

    return `${startCity} – ${endCity}`;
  }

  get _tripPointsBorderDates() {
    if (this._tripPointsInfo.length === 0) {
      return ``;
    }

    const startFormattedDate = moment(this._tripPointsInfo.sort(compareByEvent)[0].start).format(`MMM D`);
    const endFormattedDate = moment(this._tripPointsInfo.sort(compareByEvent)[this._tripPointsInfo.length - 1].end).format(`MMM D`);

    if (startFormattedDate === endFormattedDate) {
      return startFormattedDate;
    }

    return `${startFormattedDate} – ${endFormattedDate}`;
  }

  get _template() {
    return `
      <div>
        <i class="trip-icon">⛰️</i>
        <h1 class="trip__points">${this._tripPointsCities}</h1>
        <p class="trip__dates">${this._tripPointsBorderDates}</p>
      </div>
    `.trim();
  }
}
