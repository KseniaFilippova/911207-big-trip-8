import Component from './component';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._lowerCaseName = data.name.toLowerCase();
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
        <input type="radio" id="filter-${this._lowerCaseName}" name="filter" value="${this._lowerCaseName}" ${this._isChecked ? `checked` : ``}>
        <label class="trip-filter__item" for="filter-${this._lowerCaseName}">${this._name}</label>
      </span>
    `.trim();
  }

  _onFilterClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  _bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}
