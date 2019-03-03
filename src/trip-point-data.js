const TRIP_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `checkIn`, `sightseeing`, `restaurant`];

const ICONS = {
  taxi: `🚕`,
  bus: `🚌`,
  train: `🚂`,
  ship: `🛳️`,
  transport: `🚊`,
  drive: `🚗`,
  flight: `✈️`,
  checkIn: `🏨`,
  sightseeing: `🏛️`,
  restaurant: `🍴`,
};

const OFFERS = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];
const OFFERS_MIN_COUNT = 0;
const OFFERS_MAX_COUNT = 2;

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Aliquam erat volutpat.`,
  `In rutrum ac purus sit amet tempus.`
];
const DESCRIPTIONS_MIN_COUNT = 1;
const DESCRIPTIONS_MAX_COUNT = 3;

const MIN_PRICE = 10;
const MAX_PRICE = 100;

const compareRandom = () => Math.random() - 0.5;
const createRandomIntegerNumber = (minNumber, maxNumber) => Math.floor(minNumber + Math.random() * (maxNumber + 1 - minNumber));
const createRandomList = (originalList, minCount, maxCount) => {
  const randomList = originalList.slice().sort(compareRandom);
  randomList.length = createRandomIntegerNumber(minCount, maxCount);

  return randomList;
};

const tripPointData = {
  icon: ICONS[TRIP_TYPES[createRandomIntegerNumber(0, TRIP_TYPES.length - 1)]],
  picture: `http://picsum.photos/300/150?r=${Math.random()}`,
  offers: new Set(createRandomList(OFFERS, OFFERS_MIN_COUNT, OFFERS_MAX_COUNT)),
  description: createRandomList(DESCRIPTIONS, DESCRIPTIONS_MIN_COUNT, DESCRIPTIONS_MAX_COUNT).join(` `),
  start: new Date(),
  end: new Date(Date.now() + createRandomIntegerNumber(1, 3) * 60 * 60 * 1000),
  price: createRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
};

export {tripPointData};
