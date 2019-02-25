const createTripPoint = () => {
  const tripPoint = document.createElement(`article`);
  tripPoint.className = `trip-point`;
  tripPoint.innerHTML = `
    <i class="trip-icon">🚕</i>
    <h3 class="trip-point__title">Taxi to Airport</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">10:00&nbsp;— 11:00</span>
      <span class="trip-point__duration">1h 30m</span>
    </p>
    <p class="trip-point__price">€&nbsp;20</p>
    <ul class="trip-point__offers">
      <li>
        <button class="trip-point__offer">Order UBER +€&nbsp;20</button>
      </li>
      <li>
        <button class="trip-point__offer">Upgrade to business +€&nbsp;20</button>
      </li>
    </ul>
  `;

  return tripPoint;
};

export {createTripPoint};
