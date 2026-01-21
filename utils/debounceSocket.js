const debounceMap = new Map();

/**
 * Debounce socket emits per key
 * @param {Object} io - socket.io instance
 * @param {String} room - socket room name
 * @param {String} event - event name
 * @param {Number} delay - debounce time (ms)
 */

function debounceEmit(io, room, event, delay = 300) {
  const key = `${room}:${event}`;

  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key));
  }

  const timeout = setTimeout(() => {
    io.to(room).emit(event);
    debounceMap.delete(key);
  }, delay);

  debounceMap.set(key, timeout);
}

module.exports = debounceEmit;
