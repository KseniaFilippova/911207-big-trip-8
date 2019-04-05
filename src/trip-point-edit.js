import {Component} from './component';
import {tripTypesData} from './trip-types-data';
import {createMapper} from './create-mapper';

import flatpickr from 'flatpickr';
import moment from 'moment';

const ESC_KEYCODE = 27;

class TripPointEdit extends Component {
  constructor(data, possibleDestinations = [], possibleOffers = []) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._isFavorite = data.isFavorite;
    this._city = data.city;
    this._description = data.description;
    this._pictures = data.pictures;
    this._offers = data.offers;

    this._possibleDestinations = possibleDestinations;
    this._possibleOffers = possibleOffers;

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);

    this._onDelete = null;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);

    this._onEscape = null;
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);

    this._onTripTypeClick = this._onTripTypeClick.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
  }

  updateData(data) {
    this._type = data.type;
    this._start = data.start;
    this._end = data.end;
    this._price = data.price;
    this._isFavorite = data.isFavorite;
    this._city = data.city;
    this._description = data.description;
    this._pictures = data.pictures;
    this._offers = data.offers;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onEscape(fn) {
    this._onEscape = fn;
  }

  blockTripPointOnSave() {
    const saveButton = this._element.querySelector(`button[type="submit"]`);
    saveButton.innerText = `Saving...`;
    saveButton.disabled = true;

    this._element.querySelector(`button[type="reset"]`).disabled = true;
  }

  unblockTripPointOnSave() {
    const saveButton = this._element.querySelector(`button[type="submit"]`);
    saveButton.innerText = `Save`;
    saveButton.disabled = false;

    this._element.querySelector(`button[type="reset"]`).disabled = false;
  }

  blockTripPointOnDelete() {
    this._element.querySelector(`button[type="submit"]`).disabled = true;

    const deleteButton = this._element.querySelector(`button[type="reset"]`);
    deleteButton.innerText = `Deleting...`;
    deleteButton.disabled = true;
  }

  unblockTripPointOnDelete() {
    this._element.querySelector(`button[type="submit"]`).disabled = false;

    const deleteButton = this._element.querySelector(`button[type="reset"]`);
    deleteButton.innerText = `Delete`;
    deleteButton.disabled = false;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.querySelector(`.point`).style.border = `1px solid red`;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._element.querySelector(`.point`).style.border = `none`;
    }, ANIMATION_TIMEOUT);
  }

  _createTripPointOffer(offerInfo, taskId) {
    const offerId = offerInfo.title.replace(` `, `_`) + taskId;

    return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offerId}" name="offer" value="${offerInfo.title}_${offerInfo.price}"
        ${offerInfo.accepted ? `checked` : ``}>
      <label for="${offerId}" class="point__offers-label">
        <span class="point__offer-service">${offerInfo.title}</span> + €<span class="point__offer-price">${offerInfo.price}</span>
      </label>
    `;
  }

  get _tripPointOffers() {
    return this._offers.map((offerInfo) => this._createTripPointOffer(offerInfo, this._id)).join(``);
  }

  _createExtraTripPointOffer(offerInfo, tripPointId) {
    const offerId = offerInfo.name.replace(` `, `_`) + tripPointId;

    return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offerId}" name="offer" value="${offerInfo.name}_${offerInfo.price}"}>
      <label for="${offerId}" class="point__offers-label">
        <span class="point__offer-service">${offerInfo.name}</span> + €<span class="point__offer-price">${offerInfo.price}</span>
      </label>
    `;
  }

  get _extraOffers() {
    const possibleOffers = this._possibleOffers.find((offers) => offers.type === this._type);

    if (possibleOffers) {
      let extraOffers = possibleOffers.offers;

      for (const offer of this._offers) {
        extraOffers = extraOffers.filter((extraOffer) => extraOffer.name !== offer.title);
      }

      return extraOffers;
    }

    return [];
  }

  get _extraTripPointOffers() {
    return this._extraOffers.map((offerInfo) => this._createExtraTripPointOffer(offerInfo, this._id)).join(``);
  }

  _createTripPointPicture(pictureInfo) {
    return `
      <img src="${pictureInfo.src}" alt="${pictureInfo.description}" class="point__destination-image">
    `;
  }

  get _tripPointPictures() {
    return this._pictures.map(this._createTripPointPicture).join(``);
  }

  _createTripPointDestination(destinationInfo) {
    return `
      <option value="${destinationInfo.name}"></option>
    `;
  }

  get _tripPointDestinations() {
    return this._possibleDestinations.map(this._createTripPointDestination).join(``);
  }

  get _checkedTripTypes() {
    const checkedTripTypes = {
      'taxi': ``,
      'bus': ``,
      'train': ``,
      'ship': ``,
      'transport': ``,
      'drive': ``,
      'flight': ``,
      'check-in': ``,
      'sightseeing': ``,
      'restaurant': ``
    };
    checkedTripTypes[this._type] = `checked`;

    return checkedTripTypes;
  }

  get _innerTemplate() {
    const template = `
      <article class="point">
        <form action="" method="get">
          <header class="point__header">

            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle${this._id}">${tripTypesData[this._type].icon}</label>

              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle${this._id}">

              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi${this._id}" name="travelway" value="taxi"
                    ${this._checkedTripTypes.taxi}>
                  <label class="travel-way__select-label" for="travel-way-taxi${this._id}">🚕 taxi</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus${this._id}" name="travelway" value="bus"
                    ${this._checkedTripTypes.bus}>
                  <label class="travel-way__select-label" for="travel-way-bus${this._id}">🚌 bus</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train${this._id}" name="travelway" value="train"
                    ${this._checkedTripTypes.train}>
                  <label class="travel-way__select-label" for="travel-way-train${this._id}">🚂 train</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship${this._id}" name="travelway" value="ship"
                    ${this._checkedTripTypes.ship}>
                  <label class="travel-way__select-label" for="travel-way-ship${this._id}">🛳️ ship</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport${this._id}" name="travelway" value="transport"
                    ${this._checkedTripTypes.transport}>
                  <label class="travel-way__select-label" for="travel-way-transport${this._id}">🚊️ transport</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive${this._id}" name="travelway" value="drive"
                    ${this._checkedTripTypes.drive}>
                  <label class="travel-way__select-label" for="travel-way-drive${this._id}">🚗️ drive</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight${this._id}" name="travelway" value="flight"
                    ${this._checkedTripTypes.flight}>
                  <label class="travel-way__select-label" for="travel-way-flight${this._id}">✈️ flight</label>
                </div>

                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in${this._id}" name="travelway" value="check-in"
                    ${this._checkedTripTypes[`check-in`]}>
                  <label class="travel-way__select-label" for="travel-way-check-in${this._id}">🏨 check-in</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing${this._id}" name="travelway" value="sightseeing"
                    ${this._checkedTripTypes.sightseeing}>
                  <label class="travel-way__select-label" for="travel-way-sightseeing${this._id}">🏛 sightseeing</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-restaurant${this._id}" name="travelway" value="restaurant"
                    ${this._checkedTripTypes.restaurant}>
                  <label class="travel-way__select-label" for="travel-way-restaurant${this._id}">🍴 restaurant</label>
                </div>
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination${this._id}">${tripTypesData[this._type].action}</label>
              <input class="point__destination-input" list="destination-select" id="destination${this._id}" value="${this._city}" name="destination">
              <datalist id="destination-select">
                ${this._tripPointDestinations}
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
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite${this._id}" name="favorite"
                ${this._isFavorite ? `checked` : ``}>
              <label class="point__favorite" for="favorite${this._id}">favorite</label>
            </div>
          </header>

          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>

              <div class="point__offers-wrap">
                ${this._tripPointOffers}
                ${this._extraTripPointOffers}
              </div>

            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description}</p>
              <div class="point__destination-images">
                ${this._tripPointPictures}
              </div>
            </section>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="${this._totalPrice}">
        </form>
      </article>
    `.trim();

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
      start: new Date(),
      end: new Date(),
      price: 0,
      isFavorite: false,
      city: this._city,
      description: this._description,
      pictures: this._pictures,
      offers: []
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
      this._onSubmit(this._id, newData);
    }

    this.updateData(newData);
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete(this._id);
    }
  }

  _onDocumentKeydown(evt) {
    if (evt.keyCode === ESC_KEYCODE && typeof this._onEscape === `function`) {
      this._onEscape(this._id);
    }
  }

  _onTripTypeClick(evt) {
    const tripType = evt.target.value;
    if (tripType) {
      this._type = tripType;
      this._offers = [];
      this._updateElement();
    }
  }

  _onDestinationChange(evt) {
    const destinationName = evt.target.value;

    if (destinationName) {
      this._city = destinationName;
      const destinationInfo = this._possibleDestinations.find((destination) => destination.name === destinationName);

      if (destinationInfo) {
        this._description = destinationInfo.description;
        this._pictures = destinationInfo.pictures;
      } else {
        this._description = `Unknown destination`;
        this._pictures = [];
      }

      this._updateElement();
    }
  }

  _bind() {
    flatpickr(this.element.querySelector(`input[name="startTime"]`), {altInput: true, altFormat: `H:i`, enableTime: true,
      dateFormat: `Y-m-d H:i`, time_24hr: true, defaultDate: moment(this._start).format(`YYYY-MM-DD HH:mm`)});
    flatpickr(this.element.querySelector(`input[name="endTime"]`), {altInput: true, altFormat: `H:i`, enableTime: true,
      dateFormat: `Y-m-d H:i`, time_24hr: true, defaultDate: moment(this._end).format(`YYYY-MM-DD HH:mm`)});

    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`).addEventListener(`reset`, this._onDeleteButtonClick);
    document.addEventListener(`keydown`, this._onDocumentKeydown);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onTripTypeClick);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onDestinationChange);
  }

  _unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`).removeEventListener(`reset`, this._onDeleteButtonClick);
    document.removeEventListener(`keydown`, this._onDocumentKeydown);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onTripTypeClick);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onDestinationChange);
  }

  _updateElement() {
    this._unbind();
    this._element.innerHTML = this._innerTemplate;
    this._bind();
  }
}

export {TripPointEdit};
