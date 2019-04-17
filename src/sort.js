import Component from './component';

export default class Sort extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._lowerCaseName = data.name.toLowerCase();
    this._isChecked = data.isChecked;
    this._isDisabled = data.isDisabled;

    this._onSortClick = this._onSortClick.bind(this);
    this._onSort = null;
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  get _template() {
    return `
      <span>
        <input type="radio" name="trip-sorting" id="sorting-${this._lowerCaseName}" value="${this._lowerCaseName}"
          ${this._isChecked ? `checked` : ``} ${this._isDisabled ? `disabled` : ``}>
        <label class="trip-sorting__item trip-sorting__item--${this._lowerCaseName}" for="sorting-${this._lowerCaseName}">${this._name}</label>
      </span>
    `.trim();
  }

  _onSortClick() {
    if (typeof this._onSort === `function`) {
      this._onSort();
    }
  }

  _bind() {
    this._element.addEventListener(`click`, this._onSortClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onSortClick);
  }
}
