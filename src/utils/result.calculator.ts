export const calculateResult = (ca: number, exam: number) => {
  const total = ca + exam;

  let grade = "F";

  if (total >= 70) grade = "A";
  else if (total >= 60) grade = "B";
  else if (total >= 50) grade = "C";
  else if (total >= 45) grade = "D";
  else if (total >= 40) grade = "E";

  return {
    total,
    grade
  };
};