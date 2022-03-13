export const findMatchListRow = (arr) => {
  let matchList = [];
  let matchCount = 0;
  let prev = -1;

  for (let i = 0; i < arr.length; i++) {
    matchList.push([]);
    matchCount = 0;
    prev = -1;
    for (let j = 0; j < arr.length; j++) {
      if (arr[i][j] == prev && prev != -1) {
        matchCount++;
      }
      if (arr[i][j] != prev) {
        matchCount = 0;
      }
      if (arr[i][j] == prev && matchCount == 2 && prev != -1) {
        matchList[i].push([j - 2, j - 1, j]);
      }
      if (arr[i][j] == prev && matchCount > 2 && prev != -1) {
        matchList[i].at(-1).push(j);
      }
      prev = arr[i][j];
    }
  }
  return matchList;
};

export const findMatchListCol = (arr) => {
  let matchList = [];
  let matchCount = 0;
  let prev = -1;

  for (let j = 0; j < arr.length; j++) {
    matchList.push([]);
    matchCount = 0;
    prev = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][j] == prev && prev != -1) {
        matchCount++;
      }
      if (arr[i][j] != prev && prev != -1) {
        matchCount = 0;
      }
      if (arr[i][j] == prev && matchCount == 2 && prev != -1) {
        matchList[j].push([i - 2, i - 1, i]);
      }
      if (arr[i][j] == prev && matchCount > 2 && prev != -1) {
        matchList[j].at(-1).push(i);
      }
      prev = arr[i][j];
    }
  }
  return matchList;
};

/* при свапе проверяем и строки и столбцы, если matchCount больше нуля, то используем анимацию
success перезаписываем массив tableArr на новый, отображаем новый массив
далее если rowMatchCount > 0 и colMatchCount > 0 добавляем анимацию исчезания диамантов сначала 
по строчно, удаляем их, потом проверяем еще раз уже новый массив с удаленными элементами на
наличие матчей по столбцам, если они остались, то добавляем и к ним анимацию исчезновения
и удаляем их из массива
*/
export const matchObjectRowColsCount = (arr) => {
  let rowMatchList = findMatchListRow(arr);
  let colMatchList = findMatchListCol(arr);
  let rowMatchCount = rowMatchList
    .map((el) => el.length)
    .reduce((sum, el) => (sum += el));
  let colMatchCount = colMatchList
    .map((el) => el.length)
    .reduce((sum, el) => (sum += el));
  return {
    rowMatchList: rowMatchList,
    colMatchList: colMatchList,
    rowMatchCount: rowMatchCount,
    colMatchCount: colMatchCount,
  };
};

