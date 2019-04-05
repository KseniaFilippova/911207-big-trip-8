import Chart from 'chart.js';
import moment from 'moment';

import {API} from './api';
import {filtersData} from './filters-data';
import {Filter} from './filter';
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
const tripDaysContainer = document.querySelector(`.trip-points`);
const emptyTripPointsContainer = document.querySelector(`.trip__no-points`);
const tableContainer = document.querySelector(`#table`);
const statsContainer = document.querySelector(`#stats`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const newEventButton = document.querySelector(`.trip-controls__new-event`);
const tripCostInput = document.querySelector(`.trip__total-cost`);
const moneyStatCanvas = document.querySelector(`.statistic__money`);
const transportStatCanvas = document.querySelector(`.statistic__transport`);

const possibleDestinationsPromise = api.getDestinations();
const extraOffersPromise = api.getOffers();

let tripPointsInfoPromise = api.getTripPoints();

let moneyChart;
let transportChart;

const getFilterId = () => document.querySelector(`input[name="filter"]:checked`).id;

const renderFilteredTripPointsData = ([data, destinationsData, offersData]) => {
  const filterId = getFilterId();

  switch (filterId) {
    case `filter-everything`:
      renderTripDays(data, destinationsData, offersData);
      break;
    case `filter-future`:
      const futureData = data.filter((it) => it.start > Date.now());
      renderTripDays(futureData, destinationsData, offersData);
      break;
    case `filter-past`:
      const pastData = data.filter((it) => it.end < Date.now());
      renderTripDays(pastData, destinationsData, offersData);
      break;
  }
};

const renderFilters = (data) => {
  for (const filterData of data) {
    const filter = new Filter(filterData);
    filtersContainer.appendChild(filter.element);

    filter.onFilter = () => {
      Promise.all([tripPointsInfoPromise, possibleDestinationsPromise, extraOffersPromise])
        .then((values) => renderFilteredTripPointsData(values));
    };
  }
};

const deleteTripPoint = (id, tripPointEdit) => {
  tripPointEdit.blockTripPointOnDelete();

  api.deleteTripPoint(id)
    .then(() => {
      tripPointsInfoPromise = api.getTripPoints();

      Promise.all([tripPointsInfoPromise, possibleDestinationsPromise, extraOffersPromise])
        .then((values) => renderFilteredTripPointsData(values));
    })
    .catch(() => {
      tripPointEdit.shake();
      tripPointEdit.unblockTripPointOnDelete();
    });
};

const renderTripPoint = (data, destinationsData, offersData, container, isNew = false) => {
  const tripPoint = new TripPoint(data, offersData);
  const tripPointEdit = new TripPointEdit(data, destinationsData, offersData);

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
    Object.assign(data, newData);

    tripPointEdit.blockTripPointOnSave();

    api.updateTripPoint(id, data.toRaw())
      .then((newTripPoint) => {
        tripPoint.updateData(newTripPoint);
        tripPointEdit.unblockTripPointOnSave();
        tripPointsInfoPromise = api.getTripPoints();

        Promise.all([tripPointsInfoPromise, possibleDestinationsPromise, extraOffersPromise])
          .then((values) => renderFilteredTripPointsData(values));
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

const getTripCost = () => {
  const tripPointsTotalPrices = document.querySelectorAll(`.trip-point__price span`);
  const tripCost = [...tripPointsTotalPrices].reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.innerText, 10);
  }, 0);

  return `€ ` + tripCost;
};

const renderTripDays = (data, destinationsData, offersData) => {
  tripDaysContainer.innerHTML = ``;
  const tripDaysInfo = new Map();

  for (const tripPointData of data) {
    const tripDayDate = moment(tripPointData.start).format(`MMM D`);

    if (!tripDaysInfo.has(tripDayDate)) {
      const tripDay = new TripDay(tripDayDate);
      const tripDayPointsContainer = tripDay.element.querySelector(`.trip-day__items`);

      tripDaysContainer.appendChild(tripDay.element);
      tripDaysInfo.set(tripDayDate, tripDay);
      renderTripPoint(tripPointData, destinationsData, offersData, tripDayPointsContainer);
    } else {
      const tripDay = tripDaysInfo.get(tripDayDate);
      const tripDayPointsContainer = tripDay.element.querySelector(`.trip-day__items`);
      renderTripPoint(tripPointData, destinationsData, offersData, tripDayPointsContainer);
    }
  }

  tripCostInput.innerText = getTripCost(data);
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
    tripPointsInfoPromise.then(renderStats);

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

Promise.all([tripPointsInfoPromise, possibleDestinationsPromise, extraOffersPromise])
  .then((values) => {
    emptyTripPointsContainer.innerText = `Loading route...`;
    renderFilteredTripPointsData(values);
    emptyTripPointsContainer.classList.add(`visually-hidden`);
  })
  .catch(() => {
    emptyTripPointsContainer.innerText = `Something went wrong while loading your route info. Check your connection or try again later.`;
  });

tableButton.addEventListener(`click`, onTableButtonClick);
statsButton.addEventListener(`click`, onStatsButtonClick);
newEventButton.addEventListener(`click`, onNewEventButtonClick);
