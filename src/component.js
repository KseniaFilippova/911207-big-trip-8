import {createElement} from './create-element';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._template);
      this._bind();
    }

    return this._element;
  }

  get _template() {}

  destroy() {
    this._unbind();
    this._element = null;
  }

  _bind() {}

  _unbind() {}

  _updateElement() {}
}
