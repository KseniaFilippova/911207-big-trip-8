import ModelTripPoint from './model-trip-point';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTripPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then((tripPoints) => tripPoints.filter((tripPoint) => tripPoint !== null))
      .then(ModelTripPoint.parseTripPoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON);
  }

  createTripPoint(data) {
    return this._load({
      url: `points`,
      method: `POST`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoint);
  }

  updateTripPoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: `PUT`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoint);
  }

  deleteTripPoint(id) {
    return this._load({url: `points/${id}`, method: `DELETE`});
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
