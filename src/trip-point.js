import Component from './component';
import {tripTypesData} from './trip-types-data';

import moment from 'moment';

const ONE_HOUR_MILISECONDS = 3600000;
const ONE_DAY_MILISECONDS = 86400000;

const formatLeadingZero = (number) => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};

const getFormattedDuration = (startDateMs, endDateMs) => {
  const diff = endDateMs - startDateMs;
  const duration = moment.duration(diff);

  if (diff < ONE_HOUR_MILISECONDS) {
    return `${formatLeadingZero(duration.minutes())}M`;
  } else if (diff < ONE_DAY_MILISECONDS) {
    return `${formatLeadingZero(duration.hours())}H ${formatLeadingZero(duration.minutes())}M`;
  }

  return `${formatLeadingZero(Math.floor(diff / ONE_DAY_MILISECONDS))}D ${formatLeadingZero(duration.hours())}H ${formatLeadingZero(duration.minutes())}M`;
};

export default class TripPoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._start = data.start;
    this._end = data.end;
    this._city = data.city;
    this._offers = data.offers;
    this._basePrice = data.basePrice;
    this._totalPrice = data.totalPrice;

    this._onClick = null;
    this._onTripPointClick = this._onTripPointClick.bind(this);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  updateData(data) {
    this._type = data.type;
    this._start = data.start;
    this._end = data.end;
    this._city = data.city;
    this._offers = data.offers;
    this._basePrice = data.basePrice;
    this._totalPrice = data.totalPrice;
  }

  _createTripPointOffer(offerInfo) {
    return `
      <li>
        <button class="trip-point__offer">${offerInfo.title} €${offerInfo.price}</button>
      </li>
    `;
  }

  get _tripOffers() {
    return this._offers.filter((offer) => offer.accepted).map(this._createTripPointOffer).splice(0, 3).join(``);
  }

  get _template() {
    return `
      <article class = "trip-point">
        <i class="trip-icon">${tripTypesData[this._type].icon}</i>
        <h3 class="trip-point__title">${tripTypesData[this._type].action} ${this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${moment(this._start).format(`HH:mm`)}&nbsp;— ${moment(this._end).format(`HH:mm`)}</span>
          <span class="trip-point__duration">${getFormattedDuration(this._start, this._end)}</span>
        </p>
        <p class="trip-point__price">€&nbsp;
          <span>${this._totalPrice}</span>
        </p>
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
