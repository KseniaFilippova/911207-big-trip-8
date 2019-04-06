import moment from 'moment';

const createMapper = (target) => {
  return {
    travelway: (value) => {
      target.type = value;
    },
    destination: (value) => {
      target.city = value;
    },
    startTime: (value) => {
      const startDate = moment(value, [`YYYY-MM-DD HH:mm`]);
      target.start.setMonth(startDate.month());
      target.start.setDate(startDate.date());
      target.start.setHours(startDate.hours());
      target.start.setMinutes(startDate.minutes());
    },
    endTime: (value) => {
      const endDate = moment(value, [`YYYY-MM-DD HH:mm`]);
      target.end.setMonth(endDate.month());
      target.end.setDate(endDate.date());
      target.end.setHours(endDate.hours());
      target.end.setMinutes(endDate.minutes());
    },
    price: (value) => {
      target.basePrice = parseInt(value, 10);
    },
    offer: (value) => {
      const offerInfoArr = value.split(`_`);
      const [offerTitle, offerPrice] = offerInfoArr;
      target.offers.push({title: offerTitle, price: offerPrice, accepted: true});
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
