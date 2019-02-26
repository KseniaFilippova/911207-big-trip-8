import {createFilter} from './create-filter';
import {createTripPoint} from './create-trip-point';

const MAX_TRIP_POINTS_COUNT = 10;
const DEFAULT_TRIP_POINTS_COUNT = 7;

const filtersContainer = document.querySelector(`.trip-filter`);
const tripPointsContainer = document.querySelector(`.trip-day__items`);

const filtersData = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`}
];

const createRandomIntegerNumber = (minNumber, maxNumber) => Math.floor(minNumber + Math.random() * (maxNumber + 1 - minNumber));

const renderFilters = (data) => {
  const filters = data.map(createFilter);
  filtersContainer.innerHTML = filters.join(``);
};

const renderTripPoints = (count) => {
  const tripPoints = new Array(count);
  for (let i = 0; i < count; i++) {
    tripPoints[i] = createTripPoint();
  }
  tripPointsContainer.innerHTML = tripPoints.join(``);
};

const onFiltersContainerChange = () => {
  renderTripPoints(createRandomIntegerNumber(0, MAX_TRIP_POINTS_COUNT));
};

renderFilters(filtersData);
renderTripPoints(DEFAULT_TRIP_POINTS_COUNT);

filtersContainer.addEventListener(`change`, onFiltersContainerChange);
