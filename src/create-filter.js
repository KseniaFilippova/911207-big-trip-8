const MAX_TRIP_POINTS_COUNT = 10;

const createRandomIntegerNumber = (minNumber, maxNumber) => Math.floor(minNumber + Math.random() * (maxNumber + 1 - minNumber));

const createElement = (template) => {
  const templateElement = document.createElement(`template`);
  templateElement.innerHTML = template;
  return templateElement.content;
};

const createFilter = (filterData, renderTripPointsDelegate) => {
  const id = filterData.name.toLowerCase();
  const template = `
    <input type="radio" id="filter-${id}" name="filter" value="${id}" checked="${filterData.isChecked}">
    <label class="trip-filter__item" for="filter-${id}">${filterData.name}</label>
  `;
  const element = createElement(template);
  const input = element.querySelector(`input`);
  input.addEventListener(`change`, () => renderTripPointsDelegate(createRandomIntegerNumber(0, MAX_TRIP_POINTS_COUNT)));

  return element;
};

export {createFilter};
