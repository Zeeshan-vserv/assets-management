export function getISTDate() {
  const now = new Date();
  // IST is UTC+5:30
  return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
}