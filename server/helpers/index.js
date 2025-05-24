module.exports = {
  calculatePrice: (city, start, end) => {
    const duration = (end - start) / 1000 / 60 / 60;
    if (city === "New York") {
      return 5 * Math.ceil(duration);
    }
    if (city === "Washington") {
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
    }
    throw new Error("Unknown city pricing");
  },
};
