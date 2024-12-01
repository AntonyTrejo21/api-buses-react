const API_URL = 'http://localhost:8080/buses'; 

export const fetchBuses = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
};
