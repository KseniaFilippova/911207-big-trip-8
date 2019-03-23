import Chart from 'chart.js';

import {filtersData} from './filters-data';
import {Filter} from './filter';
import {tripPointsData} from './trip-points-data';
import {tripTypesData} from './trip-types-data';
import {TripPoint} from './trip-point';
import {TripPointEdit} from './trip-point-edit';
import {createMoneyChartInfo} from './create-money-chart-info';
import {createTransportChartInfo} from './create-transport-chart-info';

const filtersContainer = document.querySelector(`.trip-filter`);
const tripPointsContainer = document.querySelector(`.trip-day__items`);
const tableContainer = document.querySelector(`#table`);
const statsContainer = document.querySelector(`#stats`);
const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);
const moneyStatCanvas = document.querySelector(`.statistic__money`);
const transportStatCanvas = document.querySelector(`.statistic__transport`);

const filterTripPointsData = (data, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return data;
    case `filter-future`:
      return data.filter((it) => it.start > Date.now());
    case `filter-past`:
      return data.filter((it) => it.end < Date.now());
    default:
      return undefined;
  }
};

const deleteTripPointData = (data, tripPointDataToDelete) => {
  const index = data.findIndex((it) => it === tripPointDataToDelete);
  data.splice(index, 1);
  return data;
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

const renderFilters = (data) => {
  for (const filterData of data) {
    const filter = new Filter(filterData);
    filtersContainer.appendChild(filter.element);

    filter.onFilter = (evt) => {
      const filterName = evt.target.id;
      if (filterName) {
        const filteredTripPointsData = filterTripPointsData(tripPointsData, filterName);
        renderTripPoints(filteredTripPointsData);
      }
    };
  }
};

const renderTripPoints = (data) => {
  tripPointsContainer.innerHTML = ``;

  for (const tripPointData of data) {
    const tripPoint = new TripPoint(tripPointData);
    const tripPointEdit = new TripPointEdit(tripPointData);

    tripPointsContainer.appendChild(tripPoint.element);

    tripPoint.onClick = () => {
      tripPointsContainer.replaceChild(tripPointEdit.element, tripPoint.element);
      tripPoint.destroy();
    };

    tripPointEdit.onSubmit = (newData) => {
      Object.assign(tripPointData, newData);
      tripPoint.updateData(tripPointData);

      tripPointsContainer.replaceChild(tripPoint.element, tripPointEdit.element);
      tripPointEdit.destroy();
    };

    tripPointEdit.onDelete = () => {
      deleteTripPointData(data, tripPointData);
      tripPointsContainer.removeChild(tripPointEdit.element);
      tripPointEdit.destroy();
    };
  }
};

const renderStats = (data) => {
  const moneyCountInfo = getMoneyCountInfo(data);
  const moneyChartInfo = createMoneyChartInfo(moneyCountInfo);
  const moneyChart = new Chart(moneyStatCanvas, moneyChartInfo);// eslint-disable-line no-unused-vars

  const transportCountInfo = getTransportCountInfo(data);
  const transportChartInfo = createTransportChartInfo(transportCountInfo);
  const transportChart = new Chart(transportStatCanvas, transportChartInfo);// eslint-disable-line no-unused-vars
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
    renderStats(tripPointsData);

    tableContainer.classList.add(`visually-hidden`);
    statsContainer.classList.remove(`visually-hidden`);
  }
};

renderFilters(filtersData);
renderTripPoints(tripPointsData);
tableButton.addEventListener(`click`, onTableButtonClick);
statsButton.addEventListener(`click`, onStatsButtonClick);
