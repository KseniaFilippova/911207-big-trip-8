const createTripPointOffer = (offerName) => `
  <li>
    <button class="trip-point__offer">${offerName}</button>
  </li>
`;

const createTripPoint = (data) => {
  const timeOptions = {
    hour: `numeric`,
    minute: `numeric`,
  };
  const startTime = data.start.toLocaleString(`ru`, timeOptions);
  const endTime = data.end.toLocaleString(`ru`, timeOptions);
  const duration = data.end - data.start;
  const hoursDuration = Math.floor(duration / 3600000);
  const minutesDuration = Math.floor((duration % 3600000) / 60000);

  let offers = ``;
  if (data.offers) {
    offers = [...data.offers].map(createTripPointOffer).join(``);
  }

  return `
    <article class = "trip-point">
      <i class="trip-icon">${data.icon}</i>
      <h3 class="trip-point__title">${data.description}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${startTime}&nbsp;— ${endTime}</span>
        <span class="trip-point__duration">${hoursDuration}h ${minutesDuration}m</span>
      </p>
      <p class="trip-point__price">€&nbsp;${data.price}</p>
      <ul class="trip-point__offers">
        ${offers}
      </ul>
    </article>
  `;
};

export {createTripPoint};
