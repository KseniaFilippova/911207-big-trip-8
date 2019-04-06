import Chart from 'chart.js';
import moment from 'moment';

import {API} from './api';
import {filtersData} from './filters-data';
import {Filter} from './filter';
import {sortsData} from './sorts-data';
import {Sort} from './sort';
import {TotalCost} from './total-cost';
import {tripTypesData} from './trip-types-data';
import {newTripPointData} from './new-trip-point-data';
import {TripDay} from './trip-day';
import {TripPoint} from './trip-point';
import {TripPointEdit} from './trip-point-edit';
import {createMoneyChartInfo} from './create-money-chart-info';
import {createTransportChartInfo} from './create-transport-chart-info';

const AUTHORIZATION = `Basic li0t9kor9080aa`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const api = new API(END_POINT, AUTHORIZATION);

const filtersContainer = document.querySelector(`.trip-filter`);
const sortsContainer = document.querySelector(`.trip-sorting`);
const totalCostContainer = document.querySelector(`.trip__total`);
const tripDaysContainer = document.querySelector(`.trip-points`);
const emptyTripPointsContainer = document.querySelector(`.trip__no-points`);
const tableContainer = document.querySelector(`#table`);
const statsContainer = document.querySelector(`#stats`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const newEventButton = document.querySelector(`.trip-controls__new-event`);
const moneyStatCanvas = document.querySelector(`.statistic__money`);
const transportStatCanvas = document.querySelector(`.statistic__transport`);
const possibleDestinationsPromise = api.getDestinations();
const extraOffersPromise = api.getOffers();

let tripPointsDataPromise = api.getTripPoints();

let moneyChart;
let transportChart;

const getFilterId = () => document.querySelector(`input[name="filter"]:checked`).id;
const getSortId = () => document.querySelector(`input[name="trip-sorting"]:checked`).id;
const compareByEvent = (a, b) => a.start - b.start;
const compareByDuration = (a, b) => (b.end - b.start) - (a.end - a.start);
const compareByPrice = (a, b) => b.totalPrice - a.totalPrice;

const getSortedTripPointsData = (tripPointsData, sortId) => {
  const result = tripPointsData.slice();

  switch (sortId) {
    case `sorting-event`:
      return result.sort(compareByEvent);
    case `sorting-time`:
      return result.sort(compareByDuration);
    case `sorting-price`:
      return result.sort(compareByPrice);
    default:
      throw new Error(`Unknown sort id: ${sortId}`);
  }
};

const renderFilteredTripPoints = ([tripPointsData, destinationsData, offersData]) => {
  const filterId = getFilterId();
  const sortId = getSortId();

  const sortedTripPointsData = getSortedTripPointsData(tripPointsData, sortId);

  switch (filterId) {
    case `filter-everything`:
      renderTripDays(sortedTripPointsData, destinationsData, offersData);
      break;
    case `filter-future`:
      const sortedFutureTripPointsData = sortedTripPointsData.filter((tripPointData) => tripPointData.start > Date.now());
      renderTripDays(sortedFutureTripPointsData, destinationsData, offersData);
      break;
    case `filter-past`:
      const sortedPastTripPointsData = sortedTripPointsData.filter((tripPointData) => tripPointData.end < Date.now());
      renderTripDays(sortedPastTripPointsData, destinationsData, offersData);
  }
};

const renderSorts = (data) => {
  for (const sortData of data) {
    const sort = new Sort(sortData);
    sortsContainer.appendChild(sort.element);

    sort.onSort = () => {
      Promise.all([tripPointsDataPromise, possibleDestinationsPromise, extraOffersPromise])
        .then((values) => renderFilteredTripPoints(values));
    };
  }
};

const renderFilters = (data) => {
  for (const filterData of data) {
    const filter = new Filter(filterData);
    filtersContainer.appendChild(filter.element);

    filter.onFilter = () => {
      Promise.all([tripPointsDataPromise, possibleDestinationsPromise, extraOffersPromise])
        .then((values) => renderFilteredTripPoints(values));
    };
  }
};

const renderTotalCost = (tripPointsData) => {
  totalCostContainer.innerHTML = ``;
  const totalCost = new TotalCost(tripPointsData);
  totalCostContainer.appendChild(totalCost.element);
};

const deleteTripPoint = (id, tripPointEdit) => {
  tripPointEdit.blockTripPointOnDelete();

  api.deleteTripPoint(id)
    .then(() => {
      tripPointsDataPromise = api.getTripPoints();

      Promise.all([tripPointsDataPromise, possibleDestinationsPromise, extraOffersPromise])
        .then((values) => renderFilteredTripPoints(values));
    })
    .catch(() => {
      tripPointEdit.shake();
      tripPointEdit.unblockTripPointOnDelete();
    });
};

const renderTripPoint = (tripPointData, destinationsData, offersData, container, isNew = false) => {
  const tripPoint = new TripPoint(tripPointData, offersData);
  const tripPointEdit = new TripPointEdit(tripPointData, destinationsData, offersData);

  if (isNew) {
    tripPointEdit.element.style = `margin-top: 40px`;
    container.insertBefore(tripPointEdit.element, tripDaysContainer.firstChild);
  } else {
    container.appendChild(tripPoint.element);
  }

  tripPoint.onClick = () => {
    container.replaceChild(tripPointEdit.element, tripPoint.element);
    tripPoint.destroy();
  };

  tripPointEdit.onSubmit = (id, newData) => {
    Object.assign(tripPointData, newData);

    tripPointEdit.blockTripPointOnSave();

    api.updateTripPoint(id, tripPointData.toRaw())
      .then((newTripPoint) => {
        tripPoint.updateData(newTripPoint);
        tripPointEdit.unblockTripPointOnSave();
        tripPointsDataPromise = api.getTripPoints();

        Promise.all([tripPointsDataPromise, possibleDestinationsPromise, extraOffersPromise])
          .then((values) => renderFilteredTripPoints(values));
      })
      .catch(() => {
        tripPointEdit.shake();
        tripPointEdit.unblockTripPointOnSave();
      });
  };

  tripPointEdit.onDelete = (id) => {
    deleteTripPoint(id, tripPointEdit);
  };

  tripPointEdit.onEscape = (id) => {
    if (isNew) {
      deleteTripPoint(id, tripPointEdit);
    } else {
      container.replaceChild(tripPoint.element, tripPointEdit.element);
      tripPointEdit.destroy();
    }
  };
};

const renderTripDays = (tripPointsData, destinationsData, offersData) => {
  tripDaysContainer.innerHTML = ``;

  let previousTripDayDate;

  for (const tripPointData of tripPointsData) {
    const tripDayDate = moment(tripPointData.start).format(`MMM D`);

    if (tripDayDate !== previousTripDayDate) {
      const tripDay = new TripDay(tripDayDate);
      const tripDayPointsContainer = tripDay.element.querySelector(`.trip-day__items`);

      tripDaysContainer.appendChild(tripDay.element);
      renderTripPoint(tripPointData, destinationsData, offersData, tripDayPointsContainer);
    } else {
      const tripDayElement = tripDaysContainer.lastChild;
      const tripDayPointsContainer = tripDayElement.querySelector(`.trip-day__items`);
      renderTripPoint(tripPointData, destinationsData, offersData, tripDayPointsContainer);
    }

    previousTripDayDate = tripDayDate;
  }

  renderTotalCost(tripPointsData);
};

const getMoneyCountInfo = (data) => {
  const moneyCountInfo = {};

  for (const tripPointData of data) {
    const tripType = tripTypesData[tripPointData.type].icon + ` ` + tripPointData.type.toUpperCase();

    if (moneyCountInfo[tripType]) {
      moneyCountInfo[tripType] += tripPointData.price;
    } else {
      moneyCountInfo[tripType] = tripPointData.price;
    }
  }

  return moneyCountInfo;
};

const getTransportCountInfo = (data) => {
  const transportCountInfo = {};

  for (const tripPointData of data) {
    const tripType = tripTypesData[tripPointData.type].icon + ` ` + tripPointData.type.toUpperCase();

    if (transportCountInfo[tripType]) {
      transportCountInfo[tripType]++;
    } else {
      transportCountInfo[tripType] = 1;
    }
  }

  return transportCountInfo;
};

const renderStats = (data) => {
  const moneyCountInfo = getMoneyCountInfo(data);
  const moneyChartInfo = createMoneyChartInfo(moneyCountInfo);
  if (moneyChart) {
    moneyChart.destroy();
  }
  moneyChart = new Chart(moneyStatCanvas, moneyChartInfo);

  const transportCountInfo = getTransportCountInfo(data);
  const transportChartInfo = createTransportChartInfo(transportCountInfo);
  if (transportChart) {
    transportChart.destroy();
  }
  transportChart = new Chart(transportStatCanvas, transportChartInfo);
};

const onTableButtonClick = (evt) => {
  evt.preventDefault();

  if (!statsContainer.classList.contains(`visually-hidden`)) {
    statsContainer.classList.add(`visually-hidden`);
    tableContainer.classList.remove(`visually-hidden`);
  }
};

const onStatsButtonClick = (evt) => {
  evt.preventDefault();

  if (!tableContainer.classList.contains(`visually-hidden`)) {
    tripPointsDataPromise.then(renderStats);

    tableContainer.classList.add(`visually-hidden`);
    statsContainer.classList.remove(`visually-hidden`);
  }
};

const onNewEventButtonClick = () => {
  api.createTripPoint(newTripPointData)
    .then((rawData) => {
      Promise.all([possibleDestinationsPromise, extraOffersPromise])
        .then((values) => renderTripPoint(rawData, values[0], values[1], tripDaysContainer, true));
    });
};

renderFilters(filtersData);
renderSorts(sortsData);

Promise.all([tripPointsDataPromise, possibleDestinationsPromise, extraOffersPromise])
  .then((value) => {
    emptyTripPointsContainer.innerText = `Loading route...`;
    renderFilteredTripPoints(value);
    emptyTripPointsContainer.classList.add(`visually-hidden`);
  })
  .catch(() => {
    emptyTripPointsContainer.innerText = `Something went wrong while loading your route info. Check your connection or try again later.`;
  });

tableButton.addEventListener(`click`, onTableButtonClick);
statsButton.addEventListener(`click`, onStatsButtonClick);
newEventButton.addEventListener(`click`, onNewEventButtonClick);
