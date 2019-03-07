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
    const tripPointElement = tripPoint.element;

    const tripPointEdit = new TripPointEdit(tripPointData);
    const tripPointEditElement = tripPointEdit.element;

    tripPointsContainer.appendChild(tripPointElement);

    tripPoint.onClick = () => {
      tripPointsContainer.replaceChild(tripPointEditElement, tripPointElement);
    };

    tripPointEdit.onSubmit = () => {
      tripPointsContainer.replaceChild(tripPointElement, tripPointEditElement);
    };

    tripPointEdit.onReset = () => {
      tripPoint.destroy();
      tripPointEdit.destroy();
      tripPointsContainer.removeChild(tripPointEditElement);
    };
  }
};

const onFiltersContainerChange = () => {
  renderTripPoints(createRandomIntegerNumber(0, MAX_TRIP_POINTS_COUNT));
};

renderFilters(filtersData);
renderTripPoints(DEFAULT_TRIP_POINTS_COUNT);

filtersContainer.addEventListener(`change`, onFiltersContainerChange);
