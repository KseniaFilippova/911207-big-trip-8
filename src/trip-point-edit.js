import {Component} from './component';

const dayOptions = {
  day: `numeric`,
  month: `long`,
};
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

let tripPointId = 0;

class TripPointEdit extends Component{
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

    this._day = this._start.toLocaleString(`en-GB`, dayOptions);
    this._startTime = this._start.toLocaleString(`ru`, timeOptions);
    this._endTime = this._end.toLocaleString(`ru`, timeOptions);

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClickFn.bind(this);

    this._onReset = null;
    this._onResetButtonClick = this._onResetButtonClickFn.bind(this);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  _createTripPointOffer([offerName, offerPrice]) {
    return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offerName}${tripPointId}" name="offer" value="${offerName}">
      <label for="${offerName}${tripPointId}" class="point__offers-label">
        <span class="point__offer-service">${offerName}</span> + €<span class="point__offer-price">${offerPrice}</span>
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

  get _template() {
    const template = `
      <article class="point">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="MAR 18" name="day" value="${this._day}">
            </label>

            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle${tripPointId}">${tripTypes[this._type].icon}</label>

              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle${tripPointId}">

              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi${tripPointId}" name="travel-way" value="taxi"
                    ${this._checkedTripTypes.taxi}>
                  <label class="travel-way__select-label" for="travel-way-taxi${tripPointId}">🚕 taxi</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus${tripPointId}" name="travel-way" value="bus"
                    ${this._checkedTripTypes.bus}>
                  <label class="travel-way__select-label" for="travel-way-bus${tripPointId}">🚌 bus</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train${tripPointId}" name="travel-way" value="train"
                    ${this._checkedTripTypes.train}>
                  <label class="travel-way__select-label" for="travel-way-train${tripPointId}">🚂 train</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight${tripPointId}" name="travel-way" value="flight"
                    ${this._checkedTripTypes.flight}>
                  <label class="travel-way__select-label" for="travel-way-flight${tripPointId}">✈️ flight</label>
                </div>

                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in${tripPointId}" name="travel-way" value="check-in"
                    ${this._checkedTripTypes[`check-in`]}>
                  <label class="travel-way__select-label" for="travel-way-check-in${tripPointId}">🏨 check-in</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing${tripPointId}" name="travel-way" value="sight-seeing"
                    ${this._checkedTripTypes.sightseeing}>
                  <label class="travel-way__select-label" for="travel-way-sightseeing${tripPointId}">🏛 sightseeing</label>
                </div>
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination${tripPointId}">${tripTypes[this._type].action}</label>
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
              <input class="point__input" type="text" value="${this._startTime} — ${this._endTime}" name="time" placeholder="00:00 — 00:00">
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

  _onSubmitButtonClickFn(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  _onResetButtonClickFn(evt) {
    evt.preventDefault();
    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  _bind() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`).addEventListener(`reset`, this._onResetButtonClick);
  }

  _unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`).removeEventListener(`reset`, this._onResetButtonClick);
  }
}

export {TripPointEdit};
