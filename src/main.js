import Chart from 'chart.js';

import {API} from './api';
import {filtersData} from './filters-data';
import {Filter} from './filter';
import {tripTypesData} from './trip-types-data';
import {TripPoint} from './trip-point';
import {TripPointEdit} from './trip-point-edit';
import {createMoneyChartInfo} from './create-money-chart-info';
import {createTransportChartInfo} from './create-transport-chart-info';

const AUTHORIZATION = `Basic ei0w990or99080b`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const api = new API(END_POINT, AUTHORIZATION);

const filtersContainer = document.querySelector(`.trip-filter`);
const tripPointsContainer = document.querySelector(`.trip-day__items`);
const emptyTripPointsContainer = document.querySelector(`.trip__no-points`);
const tableContainer = document.querySelector(`#table`);
const statsContainer = document.querySelector(`#stats`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const moneyStatCanvas = document.querySelector(`.statistic__money`);
const transportStatCanvas = document.querySelector(`.statistic__transport`);

let moneyChart;
let transportChart;

const getFilterId = () => {
  const filters = document.querySelectorAll(`input[name="filter"]`);
  const checkedFilter = Array.from(filters).find((filter) => filter.checked === true);

  return checkedFilter.id;
};

const renderFilteredTripPointsData = ([data, destinationsData, offersData]) => {
  const filterId = getFilterId();

  switch (filterId) {
    case `filter-everything`:
      renderTripPoints(data, destinationsData, offersData);
      break;
    case `filter-future`:
      const futureData = data.filter((it) => it.start > Date.now());
      renderTripPoints(futureData, destinationsData, offersData);
      break;
    case `filter-past`:
      const pastData = data.filter((it) => it.end < Date.now());
      renderTripPoints(pastData, destinationsData, offersData);
      break;
  }
};

const renderFilters = (data) => {
  for (const filterData of data) {
    const filter = new Filter(filterData);
    filtersContainer.appendChild(filter.element);

    filter.onFilter = () => {
      Promise.all([api.getTripPoints(), api.getDestinations(), api.getOffers()])
        .then((values) => renderFilteredTripPointsData(values));
    };
  }
};

const blockTripPointOnSave = (tripPoint) => {
  const saveButton = tripPoint.element.querySelector(`button[type="submit"]`);
  saveButton.innerText = `Saving...`;
  saveButton.disabled = true;

  tripPoint.element.querySelector(`button[type="reset"]`).disabled = true;
};

const unblockTripPointOnSave = (tripPoint) => {
  const saveButton = tripPoint.element.querySelector(`button[type="submit"]`);
  saveButton.innerText = `Save`;
  saveButton.disabled = false;

  tripPoint.element.querySelector(`button[type="reset"]`).disabled = false;
};

const blockTripPointOnDelete = (tripPoint) => {
  tripPoint.element.querySelector(`button[type="submit"]`).disabled = true;

  const deleteButton = tripPoint.element.querySelector(`button[type="reset"]`);
  deleteButton.innerText = `Deleting...`;
  deleteButton.disabled = true;
};

const unblockTripPointOnDelete = (tripPoint) => {
  tripPoint.element.querySelector(`button[type="submit"]`).disabled = false;

  const deleteButton = tripPoint.element.querySelector(`button[type="reset"]`);
  deleteButton.innerText = `Delete`;
  deleteButton.disabled = false;
};

const renderTripPoints = (data, destinationsData, offersData) => {
  tripPointsContainer.innerHTML = ``;

  for (const tripPointData of data) {
    const tripPoint = new TripPoint(tripPointData);
    const tripPointEdit = new TripPointEdit(tripPointData, destinationsData, offersData);

    tripPointsContainer.appendChild(tripPoint.element);

    tripPoint.onClick = () => {
      tripPointsContainer.replaceChild(tripPointEdit.element, tripPoint.element);
      tripPoint.destroy();
    };

    tripPointEdit.onSubmit = (id, newData) => {
      Object.assign(tripPointData, newData);

      blockTripPointOnSave(tripPointEdit);

      api.updateTripPoint(id, tripPointData.toRaw())
        .then((newTripPoint) => {
          unblockTripPointOnSave(tripPointEdit);
          tripPoint.updateData(newTripPoint);
          tripPointsContainer.replaceChild(tripPoint.element, tripPointEdit.element);
          tripPointEdit.destroy();
        })
        .catch(() => {
          tripPointEdit.shake();
          unblockTripPointOnSave(tripPointEdit);
        });
    };

    tripPointEdit.onDelete = (id) => {
      blockTripPointOnDelete(tripPointEdit);

      api.deleteTripPoint(id)
        .then(() => {
          Promise.all([api.getTripPoints(), api.getDestinations(), api.getOffers()])
            .then((values) => renderFilteredTripPointsData(values));
        })
        .catch(() => {
          tripPointEdit.shake();
          unblockTripPointOnDelete(tripPointEdit);
        });
    };
  }
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
    api.getTripPoints().then(renderStats);

    tableContainer.classList.add(`visually-hidden`);
    statsContainer.classList.remove(`visually-hidden`);
  }
};

renderFilters(filtersData);

Promise.all([api.getTripPoints(), api.getDestinations(), api.getOffers()])
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
