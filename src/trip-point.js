import {Component} from './component';
import {getHours, getMinutes} from './time-utils';

const timeOptions = {
  hour: `numeric`,
  minute: `numeric`,
};
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

class TripPoint extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._offers = data.offers;

    this._startTime = this._start.toLocaleString(`ru`, timeOptions);
    this._endTime = this._end.toLocaleString(`ru`, timeOptions);
    this._hoursDuration = getHours(this._end - this._start);
    this._minutesDuration = getMinutes(this._end - this._start);

    this._onClick = null;
    this._onTripPointClick = this._onTripPointClickFn.bind(this);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _createTripPointOffer([offerName, offerPrice]) {
    return `
      <li>
        <button class="trip-point__offer">${offerName} + €${offerPrice}</button>
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
          <span class="trip-point__duration">${this._hoursDuration}h ${this._minutesDuration}m</span>
        </p>
        <p class="trip-point__price">€&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._tripOffers}
        </ul>
      </article>
    `.trim();
  }

  _onTripPointClickFn() {
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
