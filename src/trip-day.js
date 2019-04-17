import {createElement} from './create-element';

export default class TripDay {
  constructor(data) {
    this._date = data;
    this._day = data.split(` `)[1];
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._template);
    }

    return this._element;
  }

  get _template() {
    return `
      <section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${this._day}</p>
          <h2 class="trip-day__title">${this._date}</h2>
        </article>

        <div class="trip-day__items">
        </div>
      </section>
    `.trim();
  }
}
