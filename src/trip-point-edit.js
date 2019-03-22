import {Component} from './component';
import {tripTypesData} from './trip-types-data';
import {offersPricesData} from './offers-prices-data';

import flatpickr from 'flatpickr';
import moment from 'moment';

const createMapper = (target) => {
  return {
    travelway: (value) => {
      target.type = value;
    },
    destination: (value) => {
      target.city = value;
    },
    day: (value) => {
      const date = moment(value, [`MMM D`]);
      target.start.setDate(date.date());
      target.start.setMonth(date.month());

      target.end.setDate(date.date());
      target.end.setMonth(date.month());
    },
    startTime: (value) => {
      const startTime = moment(value, [`HH:mm`]);
      target.start.setHours(startTime.hours());
      target.start.setMinutes(startTime.minutes());
    },
    endTime: (value) => {
      const endTime = moment(value, [`HH:mm`]);
      target.end.setHours(endTime.hours());
      target.end.setMinutes(endTime.minutes());
    },
    price: (value) => {
      target.price = parseInt(value, 10);
    },
    offer: (value) => target.offers.add(value),
    favorite: (value) => {
      if (value === `on`) {
        target.isFavorite = true;
      } else {
        target.isFavorite = false;
      }
    },
  };
};

let tripPointId = 0;

class TripPointEdit extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._offers = data.offers;
    this._description = data.description;
    this._pictures = data.pictures;
    this._isFavorite = data.isFavorite;

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);

    this._onDelete = null;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);

    this._onTripTypeClick = this._onTripTypeClick.bind(this);
  }

  updateData(data) {
    this._type = data.type;
    this._city = data.city;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _createTripPointOffer(offerName) {
    return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offerName}${tripPointId}" name="offer" value="${offerName}">
      <label for="${offerName}${tripPointId}" class="point__offers-label">
        <span class="point__offer-service">${offerName}</span> + €<span class="point__offer-price">${offersPricesData[offerName]}</span>
      </label>
    `;
  }

  get _tripPointOffers() {
    return [...this._offers].map(this._createTripPointOffer).join(``);
  }

  _createTripPointPicture(pictureUrl) {
    return `
      <img src="${pictureUrl}" alt="picture from place" class="point__destination-image">
    `;
  }

  get _tripPointPictures() {
    return [...this._pictures].map(this._createTripPointPicture).join(``);
  }

  get _checkedTripTypes() {
    const checkedTripTypes = {
      'taxi': ``,
      'bus': ``,
      'train': ``,
      'flight': ``,
      'check-in': ``,
      'sightseeing': ``,
    };
    checkedTripTypes[this._type] = `checked`;

    return checkedTripTypes;
  }

  get _innerTemplate() {
    const template = `
      <article class="point">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="MAR 18" name="day" value="${moment(this._start).format(`MMM D`)}">
            </label>

            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle${tripPointId}">${tripTypesData[this._type].icon}</label>

              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle${tripPointId}">

              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi${tripPointId}" name="travelway" value="taxi"
                    ${this._checkedTripTypes.taxi}>
                  <label class="travel-way__select-label" for="travel-way-taxi${tripPointId}">🚕 taxi</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus${tripPointId}" name="travelway" value="bus"
                    ${this._checkedTripTypes.bus}>
                  <label class="travel-way__select-label" for="travel-way-bus${tripPointId}">🚌 bus</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train${tripPointId}" name="travelway" value="train"
                    ${this._checkedTripTypes.train}>
                  <label class="travel-way__select-label" for="travel-way-train${tripPointId}">🚂 train</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight${tripPointId}" name="travelway" value="flight"
                    ${this._checkedTripTypes.flight}>
                  <label class="travel-way__select-label" for="travel-way-flight${tripPointId}">✈️ flight</label>
                </div>

                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in${tripPointId}" name="travelway" value="check-in"
                    ${this._checkedTripTypes[`check-in`]}>
                  <label class="travel-way__select-label" for="travel-way-check-in${tripPointId}">🏨 check-in</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing${tripPointId}" name="travelway" value="sightseeing"
                    ${this._checkedTripTypes.sightseeing}>
                  <label class="travel-way__select-label" for="travel-way-sightseeing${tripPointId}">🏛 sightseeing</label>
                </div>
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination${tripPointId}">${tripTypesData[this._type].action}</label>
              <input class="point__destination-input" list="destination-select" id="destination${tripPointId}" value="${this._city}" name="destination">
              <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
                <option value="hotel"></option>
              </datalist>
            </div>

            <label class="point__time">
              choose time
              <input class="point__input" type="text" value="${moment(this._start).format(`HH:mm`)}" name="startTime" placeholder="00:00">
              <input class="point__input" type="text" value="${moment(this._end).format(`HH:mm`)}" name="endTime" placeholder="00:00">
            </label>

            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price">
            </label>

            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>

            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite${tripPointId}" name="favorite"
                ${this._isFavorite ? `checked` : ``}>
              <label class="point__favorite" for="favorite${tripPointId}">favorite</label>
            </div>
          </header>

          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>

              <div class="point__offers-wrap">
                ${this._tripPointOffers}
              </div>

            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description}</p>
              <div class="point__destination-images">
                ${this._tripPointPictures}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>
    `.trim();

    tripPointId++;

    return template;
  }

  get _template() {
    return `
      <div>
        ${this._innerTemplate}
      </div>
    `.trim();
  }

  _processForm(formData) {
    const entry = {
      type: ``,
      city: ``,
      start: new Date(),
      end: new Date(),
      price: 0,
      offers: new Set(),
      isFavorite: false,
    };

    const tripPointEditMapper = createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (tripPointEditMapper[property]) {
        tripPointEditMapper[property](value);
      }
    }

    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.updateData(newData);
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onTripTypeClick(evt) {
    const targetType = evt.target.value;
    if (targetType) {
      this._type = targetType;
      this._updateElement();
    }
  }

  _bind() {
    flatpickr(this.element.querySelector(`input[name="day"]`), {altInput: true, altFormat: `M j`, dateFormat: `M-j`});
    flatpickr(this.element.querySelector(`input[name="startTime"]`), {enableTime: true, noCalendar: true, dateFormat: `H:i`, time_24hr: true});// eslint-disable-line camelcase
    flatpickr(this.element.querySelector(`input[name="endTime"]`), {enableTime: true, noCalendar: true, dateFormat: `H:i`, time_24hr: true});// eslint-disable-line camelcase

    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`).addEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onTripTypeClick);
  }

  _unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`).removeEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onTripTypeClick);
  }

  _updateElement() {
    this._unbind();
    this._element.innerHTML = this._innerTemplate;
    this._bind();
  }
}

export {TripPointEdit};
