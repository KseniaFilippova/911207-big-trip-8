import {createFilter} from './create-filter';
import {tripPointData} from './trip-point-data';
import {TripPoint} from './trip-point';
import {TripPointEdit} from './trip-point-edit';

const MAX_TRIP_POINTS_COUNT = 10;
const DEFAULT_TRIP_POINTS_COUNT = 7;

const filtersData = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`}
];

const filtersContainer = document.querySelector(`.trip-filter`);
const tripPointsContainer = document.querySelector(`.trip-day__items`);

const createRandomIntegerNumber = (minNumber, maxNumber) => Math.floor(minNumber + Math.random() * (maxNumber + 1 - minNumber));

const renderFilters = (data) => {
  const filters = data.map(createFilter);
  filtersContainer.innerHTML = filters.join(``);
};

const renderTripPoints = (count) => {
  tripPointsContainer.innerHTML = ``;

  for (let i = 0; i < count; i++) {
    const tripPoint = new TripPoint(tripPointData);
    const tripPointEdit = new TripPointEdit(tripPointData);

    tripPointsContainer.appendChild(tripPoint.element);

    tripPoint.onClick = () => {
      tripPointsContainer.replaceChild(tripPointEdit.element, tripPoint.element);
      tripPoint.destroy();
    };

    tripPointEdit.onSubmit = (newData) => {
      tripPointData.type = newData.type;
      tripPointData.city = newData.city;
      tripPointData.start = newData.start;
      tripPointData.end = newData.end;
      tripPointData.price = newData.price;
      tripPointData.offers = newData.offers;
      tripPointData.isFavorite = newData.isFavorite;

      tripPoint.updateData(tripPointData);

      tripPointsContainer.replaceChild(tripPoint.element, tripPointEdit.element);
      tripPointEdit.destroy();
    };

    tripPointEdit.onReset = () => {
      tripPointsContainer.removeChild(tripPointEdit.element);
      tripPointEdit.destroy();
    };
  }
};

const onFiltersContainerChange = () => {
  renderTripPoints(createRandomIntegerNumber(0, MAX_TRIP_POINTS_COUNT));
};

renderFilters(filtersData);
renderTripPoints(DEFAULT_TRIP_POINTS_COUNT);

filtersContainer.addEventListener(`change`, onFiltersContainerChange);
