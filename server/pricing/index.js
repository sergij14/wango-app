const strategies = {
  washington: function (start, end) {
    let total = 0;
    let time = new Date(start);
    while (time < end) {
      const hour = time.getHours();
      const nextHour = new Date(time);
      nextHour.setHours(hour + 1);
      total += hour >= 8 && hour < 20 ? 2 : 5;
      time = nextHour;
    }
    return total;
  },

  newyork: function (start, end) {
    const duration = (end - start) / 1000 / 60 / 60;
    return 5 * Math.ceil(duration);
  },
};

module.exports = {
  calculatePrice: (cityName, start, end) => {
    const strategy = strategies[cityName.toLowerCase()];
    if (!strategy) {
      throw new Error(`No pricing strategy found for ${cityName}`);
    }
    return strategy(start, end);
  },
};
