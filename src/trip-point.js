import {Component} from './component';
import moment from 'moment';

const tripTypes = {
  'taxi': {
    icon: `🚕`,
    action: `Taxi ride to`,
  },
  'bus': {
    icon: `🚌`,
    action: `Bus ride to`,
  },
  'train': {
    icon: `🚂`,
    action: `Train ride to`,
  },
  'flight': {
    icon: `✈`,
    action: `Flight to`,
  },
  'check-in': {
    icon: `🏨`,
    action: `Check in`,
  },
  'sightseeing': {
    icon: `🏛`,
    action: `Sightseeing`,
  },
};
const offersPrices = {
  'Add luggage': 20,
  'Switch to comfort class': 50,
  'Add meal': 30,
  'Choose seats': 15,
};

const getDuration = (startDate, endDate) => {
  const diff = moment(endDate).diff(moment(startDate));

  return moment.utc(diff).format(`H[H] m[M]`);
};

class TripPoint extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._offers = data.offers;

    this._startTime = moment(this._start).format(`HH:mm`);
    this._endTime = moment(this._end).format(`HH:mm`);
    this._duration = getDuration(this._start, this._end);

    this._onClick = null;
    this._onTripPointClick = this._onTripPointClick.bind(this);
  }

  updateData(data) {
    this._type = data.type;
    this._city = data.city;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._offers = data.offers;
    this._startTime = moment(this._start).format(`HH:mm`);
    this._endTime = moment(this._end).format(`HH:mm`);
    this._duration = getDuration(this._start, this._end);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _createTripPointOffer(offerName) {
    return `
      <li>
        <button class="trip-point__offer">${offerName} + €${offersPrices[offerName]}</button>
      </li>
    `;
  }

  get _tripOffers() {
    return [...this._offers].map(this._createTripPointOffer).join(``);
  }

  get _template() {
    return `
      <article class = "trip-point">
        <i class="trip-icon">${tripTypes[this._type].icon}</i>
        <h3 class="trip-point__title">${tripTypes[this._type].action} ${this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._startTime}&nbsp;— ${this._endTime}</span>
          <span class="trip-point__duration">${this._duration}</span>
        </p>
        <p class="trip-point__price">€&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._tripOffers}
        </ul>
      </article>
    `.trim();
  }

  _onTripPointClick() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  _bind() {
    this._element.addEventListener(`click`, this._onTripPointClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onTripPointClick);
  }
}

export {TripPoint};
