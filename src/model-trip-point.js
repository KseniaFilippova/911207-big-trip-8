class ModelTripPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.start = data[`date_from`];
    this.end = data[`date_to`];
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.pictures = data[`destination`][`pictures`];
    this.offers = data[`offers`];
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.start.getTime(),
      'date_to': this.end.getTime(),
      'base_price': this.price,
      'is_favorite': this.isFavorite,
      'destination': {
        'name': this.city,
        'description': this.description,
        'pictures': this.pictures,
      },
      'offers': this.offers
    };
  }

  static parseTripPoint(data) {
    return new ModelTripPoint(data);
  }

  static parseTripPoints(data) {
    return data.map(ModelTripPoint.parseTripPoint);
  }
}

export {ModelTripPoint};
