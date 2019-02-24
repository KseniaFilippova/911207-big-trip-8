import {createFilter} from './create-filter';
import {createTripPoint} from './create-trip-point';

const DEFAULT_TRIP_POINTS_COUNT = 7;

const filtersData = [
  {name: `Everything`, isChecked: true},
  {name: `Future`, isChecked: false},
  {name: `Past`, isChecked: false}
];

const renderTripPoints = (count) => {
  const tripPointsContainer = document.querySelector(`.trip-day__items`);
  tripPointsContainer.innerHTML = ``;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(createTripPoint());
    tripPointsContainer.appendChild(fragment);
  }
};

const renderFilters = (data) => {
  const filtersContainer = document.querySelector(`.trip-filter`);
  const fragment = document.createDocumentFragment();
  data.forEach((filter) => fragment.appendChild(createFilter(filter, renderTripPoints)));
  filtersContainer.appendChild(fragment);
};

renderFilters(filtersData);
renderTripPoints(DEFAULT_TRIP_POINTS_COUNT);
