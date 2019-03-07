import {getHours, getMinutes} from './time-utils';
import {createElement} from './create-element';

class TripPoint {
  constructor(data) {
    this._type = data.type;
    this._city = data.city;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._offers = data.offers;

    this._timeOptions = {
      hour: `numeric`,
      minute: `numeric`,
    };
    this._startTime = this._start.toLocaleString(`ru`, this._timeOptions);
    this._endTime = this._end.toLocaleString(`ru`, this._timeOptions);

    this._hoursDuration = getHours(this._end - this._start);
    this._minutesDuration = getMinutes(this._end - this._start);

    this._tripTypes = {
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

    this._element = null;

    this._onClick = null;
    this._onTripPointClick = this._onTripPointClickFn.bind(this);
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._template);
      this._bind();
    }

    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  destroy() {
    this._unbind();
    this._element = null;
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
        <i class="trip-icon">${this._tripTypes[this._type].icon}</i>
        <h3 class="trip-point__title">${this._tripTypes[this._type].action} ${this._city}</h3>
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
