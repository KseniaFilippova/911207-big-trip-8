import {Component} from './component';
import {tripTypesData} from './trip-types-data';

import moment from 'moment';

const getDuration = (startDate, endDate) => {
  const diff = moment(endDate).diff(moment(startDate));

  return moment.utc(diff).format(`H[H] m[M]`);
};

class TripPoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._city = data.city;
    this._offers = data.offers;

    this._onClick = null;
    this._onTripPointClick = this._onTripPointClick.bind(this);
  }

  updateData(data) {
    this._type = data.type;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._city = data.city;
    this._offers = data.offers;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _createTripPointOffer(offerInfo) {
    return `
      <li>
        <button class="trip-point__offer">${offerInfo.title} + €${offerInfo.price}</button>
      </li>
    `;
  }

  get _tripOffers() {
    return this._offers.filter((offer) => offer.accepted).map(this._createTripPointOffer).join(``);
  }

  get _totalPrice() {
    const offersPrice = this._offers.filter((offer) => offer.accepted).reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.price, 10);
    }, 0);

    return offersPrice + this._price;
  }

  get _template() {
    return `
      <article class = "trip-point">
        <i class="trip-icon">${tripTypesData[this._type].icon}</i>
        <h3 class="trip-point__title">${tripTypesData[this._type].action} ${this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${moment(this._start).format(`HH:mm`)}&nbsp;— ${moment(this._end).format(`HH:mm`)}</span>
          <span class="trip-point__duration">${getDuration(this._start, this._end)}</span>
        </p>
        <p class="trip-point__price">€&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._tripOffers}
        </ul>
        <input type="hidden" class="point__total-price" name="total-price" value="${this._totalPrice}">
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
