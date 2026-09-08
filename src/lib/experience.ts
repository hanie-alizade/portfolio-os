const START_DATE = new Date(2019, 7, 1); // August 2019 — real career start

export function getDisplayedYearsOfExperience(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - START_DATE.getFullYear()) * 12 +
    (now.getMonth() - START_DATE.getMonth());
  return Math.floor((months - 6) / 12);
}
