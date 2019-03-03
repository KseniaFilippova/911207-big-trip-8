import {createFilter} from './create-filter';
import {createTripPoint} from './create-trip-point';
import {tripPointData} from './trip-point-data';

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

const createTripPointsList = (count) => {
  const tripPointsList = new Array(count);
  for (let i = 0; i < count; i++) {
    tripPointsList[i] = createTripPoint(tripPointData);
  }

  return tripPointsList;
};

const renderFilters = (data) => {
  const filters = data.map(createFilter);
  filtersContainer.innerHTML = filters.join(``);
};

const renderTripPointsList = (tripPointsList) => {
  tripPointsContainer.innerHTML = tripPointsList.join(``);
};

const onFiltersContainerChange = () => {
  renderTripPointsList(createTripPointsList(createRandomIntegerNumber(0, MAX_TRIP_POINTS_COUNT)));
};

renderFilters(filtersData);
renderTripPointsList(createTripPointsList(DEFAULT_TRIP_POINTS_COUNT));

filtersContainer.addEventListener(`change`, onFiltersContainerChange);
