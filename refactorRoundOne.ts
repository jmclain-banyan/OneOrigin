const API_DOMAIN = "https://jsonplaceholder.typicode.com";
let REQUESTS_SENT = 0;

const getRequest = async (endpoint: string): Promise<unknown[]> => {
  try {
    const response: Response = await fetch(API_DOMAIN + endpoint);
    if (response.status === 200) {
      REQUESTS_SENT++;
      return response.json();
    }
  } catch (error: any | unknown) {
    console.warn(error);
    throw new Error(error);
  }
};

function batchRequests(endpoint: string, totalRemain: number): void {
  if (totalRemain === 0) return;
  else {
    getRequest(endpoint);
    return batchRequests(endpoint, totalRemain - 1);
  }
}

function sendBatch(
  endpoint: string,
  maxRatePer: number,
  delaySeconds: number,
  total: number
): void {
  return (function send(initSend = true, remainingTotal = total): void {
    setTimeout(
      () => {
        const deduction =
          maxRatePer > remainingTotal ? remainingTotal : maxRatePer;
        initSend && console.time("batch");
        batchRequests(endpoint, deduction);
        console.timeLog("batch");
        if (remainingTotal <= 0) {
          console.assert(REQUESTS_SENT === total, "Request count mismatch");
          console.timeEnd("end");
        } else {
          const leftovers = remainingTotal - deduction;
          return send(false, leftovers);
        }
      },
      initSend ? 0 : delaySeconds * 1000
    );
  })();
}

console.time("started");
console.time("end");
console.timeLog("started");

// invoke the batch function, approximately 10 minutes for completion
sendBatch("/users", 5, 1, 12);
