import {Component} from './component';

class TotalCost extends Component {
  constructor(data) {
    super();
    this._tripPointsInfo = data;
    this._totalCost = this._totalTripCost;
  }

  get _totalTripCost() {
    const totalCost = this._tripPointsInfo.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.totalPrice;
    }, 0);

    return totalCost;
  }

  get _template() {
    return `
      <span class="trip__total-cost">Total: € ${this._totalCost}</span>
    `.trim();
  }
}

export {TotalCost};
