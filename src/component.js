import {createElement} from './create-element';

class Component {
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

  destroy() {
    this._unbind();
    this._element = null;
  }

  update() {}

  get _template() {}

  _bind() {}

  _unbind() {}
}

export {Component};
