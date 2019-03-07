const getHours = (milliseconds) => Math.floor(milliseconds / 3600000);
const getMinutes = (milliseconds) => Math.floor((milliseconds % 3600000) / 60000);

export {getHours, getMinutes};
