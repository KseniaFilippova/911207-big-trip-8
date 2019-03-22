import {Component} from './component';

class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._id = data.name.toLowerCase();
    this._isChecked = data.isChecked;

    this._onFilterClick = this._onFilterClick.bind(this);
    this._onFilter = null;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get _template() {
    return `
      <span>
        <input type="radio" id="filter-${this._id}" name="filter" value="${this._id}" ${this._isChecked ? `checked` : ``}>
        <label class="trip-filter__item" for="filter-${this._id}">${this._name}</label>
      </span>
    `.trim();
  }

  _onFilterClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  _bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}

export {Filter};
