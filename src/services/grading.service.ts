export function calculateGrade(score: number): string {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}

export function calculateTotal(
  ca: number,
  exam: number
): number {
  return Number((ca + exam).toFixed(2));
}