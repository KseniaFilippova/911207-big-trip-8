import {tripTypesData} from './trip-types-data';

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const newTripPointData = {
  'type': getRandomElement(Object.keys(tripTypesData)),
  'date_from': new Date(),
  'date_to': new Date(Date.now() + 2 * 60 * 60 * 1000),
  'base_price': 0,
  'is_favorite': false,
  'destination': {
    'name': ``,
    'description': ``,
    'pictures': [],
  },
  'offers': []
};
