class ModelTripPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.city = data[`destination`][`name`];
    this.start = data[`date_from`];
    this.end = data[`date_to`];
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.description = data[`destination`][`description`];
    this.pictures = data[`destination`][`pictures`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.type,
      'destination': {
        'name': this.city,
        'description': this.description,
        'pictures': this.pictures,
      },
      'date_from': this.start.getTime(),
      'date_to': this.end.getTime(),
      'base_price': this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite,
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
