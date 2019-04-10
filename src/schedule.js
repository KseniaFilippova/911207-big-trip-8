import {Component} from './component';
import moment from 'moment';

const compareByEvent = (a, b) => a.start - b.start;

class Schedule extends Component {
  constructor(data) {
    super();
    this._tripPointsInfo = data;
  }

  get _tripPointsCities() {
    const tripPointsCitiesArr = this._tripPointsInfo.sort(compareByEvent).map((tripPointInfo) => tripPointInfo.city);

    if (tripPointsCitiesArr.length === 0) {
      return `No trip points`;
    } else if (tripPointsCitiesArr.length > 5) {
      const tripPointsStartCities = tripPointsCitiesArr.slice(0, 2).join(` – `);
      const tripPointsEndCities = tripPointsCitiesArr.slice(-2).join(` – `);

      return `${tripPointsStartCities} – ... – ${tripPointsEndCities}`;
    }

    return tripPointsCitiesArr.join(` – `);
  }

  get _tripPointsBorderDates() {
    if (this._tripPointsInfo.length === 0) {
      return ``;
    }

    const tripPointsStartDate = moment(this._tripPointsInfo.sort(compareByEvent)[0].start).format(`MMM D`);
    const tripPointsEndDate = moment(this._tripPointsInfo.sort(compareByEvent)[this._tripPointsInfo.length - 1].end).format(`MMM D`);

    if (tripPointsStartDate === tripPointsEndDate) {
      return tripPointsStartDate;
    }

    return `${tripPointsStartDate} – ${tripPointsEndDate}`;
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

export {Schedule};
