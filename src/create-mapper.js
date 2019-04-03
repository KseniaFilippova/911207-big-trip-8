import moment from 'moment';

const createMapper = (target) => {
  return {
    travelway: (value) => {
      target.type = value;
    },
    destination: (value) => {
      target.city = value;
    },
    day: (value) => {
      const date = moment(value, [`MMM D`]);
      target.start.setMonth(date.month());
      target.start.setDate(date.date());

      target.end.setMonth(date.month());
      target.end.setDate(date.date());
    },
    startTime: (value) => {
      const startTime = moment(value, [`HH:mm`]);
      target.start.setHours(startTime.hours());
      target.start.setMinutes(startTime.minutes());
    },
    endTime: (value) => {
      const endTime = moment(value, [`HH:mm`]);
      target.end.setHours(endTime.hours());
      target.end.setMinutes(endTime.minutes());
    },
    price: (value) => {
      target.price = parseInt(value, 10);
      target.totalPrice = parseInt(value, 10);
    },
    offer: (value) => {
      const offerInfoArr = value.split(`_`);
      const [offerTitle, offerPrice] = offerInfoArr;
      target.offers.push({title: offerTitle, price: offerPrice, accepted: true});

      target.totalPrice += parseInt(offerPrice, 10);
    },
    totalPrice: (value) => {
      target.totalPrice = parseInt(value, 10);
    },
    favorite: (value) => {
      if (value === `on`) {
        target.isFavorite = true;
      } else {
        target.isFavorite = false;
      }
    },
  };
};

export {createMapper};
