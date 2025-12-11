
const dateStr = '2025-12-10'; // Simulated output from Venta (DATEONLY)
const dateFromStr = new Date(dateStr);

console.log("String:", dateStr);
console.log("Date object (UTC):", dateFromStr.toISOString());
console.log("Date object (Local):", dateFromStr.toString());

// If local timezone is -04:00
// new Date('2025-12-10') -> UTC 2025-12-10T00:00:00Z
// Local equivalent: 2025-12-09T20:00:00-04:00
// This confirms the previous day.
