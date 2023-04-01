const DATA = []; // for output logging

// fetch /  GET request
const fetchData = async (query) => {
  const API_URL = 'https://jsonplaceholder.typicode.com/';
  try {
    const response = await fetch(`${API_URL}/users?query=${query}`);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
// worker to stager requests frequency rates
const workerService = (
  minutesBetweenFlights,
  requestsPerFlight,
  totalRequests
) => {
  const tripsNeeded = totalRequests / requestsPerFlight;
  let tripsMade = 0;
  const minutes = minutesBetweenFlights * (1000 * 60);
  let initTrip = true; 
  // refactor / extract batch function, it could be a little more flexible 
  (function batch() {
    setTimeout(() => {
      if (initTrip) initTrip = false;
      // for loop could could be refactored and extracted to a recursive function 
      
      tripsMade++;
      if (tripsMade < tripsNeeded) {
        batch();
      } else {
        return true;
      }
    }, initTrip ? 0 : minutes); // <- prevents delay on initial request  
  })();
  return true;
};

// invoke task worker
workerService(1, 100, 1000);

/**
 * ! below for output logging only
 */
const logging = () => {
  console.log(`${new Date().toLocaleTimeString()}`, `DATA size: ${DATA.length}`);
  // below is not stopping process?
  if (DATA.length >= 1000) clearInterval(logging)
}

setInterval(logging, 1000);
