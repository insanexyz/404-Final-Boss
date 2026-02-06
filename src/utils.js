function getRandomInt(min, max) {
  // Ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);
  // Generate random integer between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  getRandomInt
}

