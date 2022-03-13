function isVertical3Match(row, col, tableArr) {
  let gemValue = tableArr[row][col];
  let matchCount = 0;
  while (row > 0 && tableArr[row - 1][col] == gemValue) {
    matchCount++;
    row--;
  }
  return matchCount > 1;
}

function isHorizontal3Match(row, col, tableArr) {
  let gemValue = tableArr[row][col];
  let matchCount = 0;
  while (col > 0 && tableArr[row][col - 1] == gemValue) {
    matchCount++;
    col--;
  }
  return matchCount > 1;
}

// Делаем проверку на 3 повторющихся элемента
export function is3Match(row, col, tableArr) {
  return (
    isVertical3Match(row, col, tableArr) ||
    isHorizontal3Match(row, col, tableArr)
  );
}
