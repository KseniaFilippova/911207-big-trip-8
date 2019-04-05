class ModelTripPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.start = data[`date_from`];
    this.end = data[`date_to`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.pictures = data[`destination`][`pictures`];
    this.offers = data[`offers`];
    this.basePrice = data[`base_price`];
    this.totalPrice = this._totalPrice;
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.start.getTime(),
      'date_to': this.end.getTime(),
      'base_price': this.basePrice,
      'is_favorite': this.isFavorite,
      'destination': {
        'name': this.city,
        'description': this.description,
        'pictures': this.pictures,
      },
      'offers': this.offers
    };
  }

  get _totalPrice() {
    const offersPrice = this.offers.filter((offer) => offer.accepted).reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.price, 10);
    }, 0);

    return offersPrice + this.basePrice;
  }

  static parseTripPoint(data) {
    return new ModelTripPoint(data);
  }

  static parseTripPoints(data) {
    return data.map(ModelTripPoint.parseTripPoint);
  }
}

export {ModelTripPoint};
