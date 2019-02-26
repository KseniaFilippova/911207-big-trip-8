const createFilter = (data) => {
  const checked = data.isChecked ? `checked` : ``;
  const id = data.name.toLowerCase();

  return `
    <input type="radio" id="filter-${id}" name="filter" value="${id}" ${checked}>
    <label class="trip-filter__item" for="filter-${id}">${data.name}</label>
  `;
};

export {createFilter};
