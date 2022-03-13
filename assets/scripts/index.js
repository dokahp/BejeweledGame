import {
  animateLeftErr,
  animateRightErr,
  animateBottomErr,
  animateTopErr,
  animateTopSucc,
  animateBottomSucc,
  animateleftSucc,
  animateRightSucc,
  fadeOut,
} from "./animating.js";
import { is3Match } from "./check3Match.js";
import {matchObjectRowColsCount} from "./findMatchList.js";

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let muted = localStorage.getItem('bejeweled_mute') || false
let gameId
let score = 0
let lifeCount = 10
let level = 1
let nextLevelPoints = 300
let diamondsArr = ["blue", "green", "black", "red", "yellow", "pink"];
let tableArr = [];
let table = document.querySelectorAll(".cell");
let activeElement = -1;
let badMove = new Audio('./assets/sounds/badmove.ogg')
let select = new Audio('./assets/sounds/select.ogg')
let combo = new Audio('./assets/sounds/combo_2.ogg')
let combo2 = new Audio('./assets/sounds/combo_6.ogg')
let good = new Audio('./assets/sounds/voice_good.ogg')
let excellent = new Audio('./assets/sounds/voice_excellent.ogg')
let gameOverSound = new Audio('./assets/sounds/voice_gameover.ogg')
let levelCompleteSound = new Audio('./assets/sounds/voice_levelcomplete.ogg')
let goSound = new Audio('./assets/sounds/voice_go.ogg')
let refreshSound = new Audio('./assets/sounds/refresh.ogg')
let lifeImg = document.querySelectorAll('.heart')
let startScreenHTML = document.querySelector('.start-screen')
let gameStatusWrapperHTML = document.querySelector('.game-status-wrapper')
let tableHTML = document.querySelector('.table')
let tableHeadHTML = document.querySelector('.table-head')
let newContinueGameButton = document.querySelector('.new-continue-game')
let mainImageSRC = document.querySelector('.main-image')
let levelNowHTML = document.querySelector('.level-now')
let nextLevelPointsHTML = document.querySelector('.next-level-points')
let gameStatusHTML = document.querySelector('.game-status')
let yourScoreCountHTML = document.querySelector('.your-score')
let goToRecordsButtonHTML = document.querySelector('.records')
let recordsScreenHTML = document.querySelector('.records-screen');
let backToMenuButton = document.querySelector('.back-to-menu')
let recordsCells = document.querySelectorAll('.record-cell')
let giveUPButton = document.querySelector('.give-up')
let volumeButton = document.querySelector('.volume')
let refreshFieldButton = document.querySelector('.refresh')
let alertOkButton = document.querySelector('.ok')
let alertWindow = document.querySelector('.alert')
let mobileLifeCount = document.querySelector('.life-count')

const getRandom = () => {
  return Math.floor(Math.random() * 6);
};

const gameOver = () => {
  if (!muted) {gameOverSound.play()}
  // скрываю поле и таблицу счета
  tableHTML.style.setProperty('display', 'none')
  tableHeadHTML.style.setProperty('display', 'none')
  // меняю изображения и текст и кнопку на соответствие поражению
  mainImageSRC.src = './assets/img/svg/defeat.svg'
  gameStatusHTML.textContent = 'Game Over'
  yourScoreCountHTML.textContent = `Your Score: ${score} Level: ${level}`
  newContinueGameButton.textContent = 'NEW GAME'
  // показываю стартовое меню
  gameStatusWrapperHTML.style.setProperty('display', 'block')
  startScreenHTML.style.setProperty('display', 'flex')
  lifeCount = 10
  setLocalRecords()
}

const winLevelUp = () => {
  if (!muted){levelCompleteSound.play()}
  tableHTML.style.setProperty('display', 'none')
  tableHeadHTML.style.setProperty('display', 'none')
  mainImageSRC.src = './assets/img/svg/victory.svg'
  gameStatusHTML.textContent = 'Level Complete'
  yourScoreCountHTML.textContent = `Your Score: ${score} Level: ${level} Life: ${lifeCount}`
  newContinueGameButton.textContent = 'CONTINUE'
  gameStatusWrapperHTML.style.setProperty('display', 'block')
  startScreenHTML.style.setProperty('display', 'flex')
  setLocalRecords()
}

const backToMenu = () => {
  recordsScreenHTML.style.setProperty('display', 'none')
  startScreenHTML.style.setProperty('display', 'flex')
}

const setLocalRecords = () => {
  let localRecords = getlocalRecords()
  let thisGame = localRecords.filter(thisId => thisId.id == gameId)
  // Игра выйграна в первый раз, записи еще нет
  if (!thisGame.length) {
    if (localRecords.length == 10) {
      localRecords = localRecords.sort((a, b) => b.score - a.score).slice(0, 9)
      localRecords.push({id: gameId, score: score, level: level, date: new Date()})
    } else {
      localRecords.push({id: gameId, score: score, level: level, date: new Date()})
    }
  } else {
    thisGame = {id: gameId, score: score, level: level, date: new Date()}
    localRecords = localRecords.map(el => el.id == gameId? thisGame: el)
  }
  localStorage.setItem('bejeweled', JSON.stringify(localRecords))
}

const getlocalRecords = () => {
  return localStorage.bejeweled && JSON.parse(localStorage.bejeweled) || []
}

const getDateTime = (date) => {
  date = new Date(date)
  return `${date.getDate()} ${MONTH[date.getMonth()]} ${date.getFullYear()} 
  ${date.getHours() < 10? '0'+ date.getHours(): date.getHours()}:${date.getMinutes() < 10? '0'+ date.getMinutes(): date.getMinutes()}`
}

const records = () => {
  startScreenHTML.style.setProperty('display', 'none')
  recordsScreenHTML.style.setProperty('display', 'flex')
  let data = getlocalRecords()
  data = data.sort((a, b) => b.score - a.score)
  for (let i = 0; i < data.length; i++) {
    let correctDateFormat = getDateTime(data[i].date)
    recordsCells[i * 4].textContent = i + 1
    recordsCells[i * 4 + 1].textContent = data[i].score
    recordsCells[i * 4 + 2].textContent = data[i].level
    recordsCells[i * 4 + 3].textContent = correctDateFormat
  }
}

// Заполняем таблицу согласно массиву tableArr
const fillTheTable = (arr) => {
  table.forEach((cell) => {
    let i = cell.dataset.cell[0];
    let j = cell.dataset.cell[1];
    cell.classList.remove('blue')
    cell.classList.remove('green')
    cell.classList.remove('black')
    cell.classList.remove('red')
    cell.classList.remove('yellow')
    cell.classList.remove('pink')
    if (arr[i][j] >= 0) {
      cell.classList.add(diamondsArr[arr[i][j]]);
    } 
  });
};
const displayNLifesCount = (count) => {
  lifeImg.forEach(el => el.style.setProperty('display', 'unset'))
  lifeImg.forEach((img, i) => {
    if (i < 10 - count) {
      img.style.setProperty('display', 'none')
    }
  })
}
const refreshField = () => {
  if (lifeCount > 1) {
    if (!muted) {refreshSound.play()}
    lifeCount--
    mobileLifeCount.textContent = lifeCount
    displayNLifesCount(lifeCount)
    tableArr = []
    for (let i = 0; i < 8; i++) {
      tableArr.push([]);
      for (let j = 0; j < 8; j++) {
        // меняем значение в массиве чтобы отсутствовали
        // сразу готовые блоки
        do {
          tableArr[i][j] = getRandom();
        } while (is3Match(i, j, tableArr));
      }
    }
    // Заполняем html таблицу согласно полученному массиву
    fillTheTable(tableArr);
  } else {
    tableHeadHTML.style.setProperty('display', 'none')
    tableHTML.style.setProperty('display', 'none')
    alertWindow.style.setProperty('display', 'flex')
  }
}


const startGame = (currentLifeCount = 10) => {
  tableArr = []
  lifeCount = currentLifeCount
  mobileLifeCount.textContent = lifeCount
  displayNLifesCount(currentLifeCount)
  // скрываем стартовый экран
  gameStatusWrapperHTML.style.setProperty('display', 'none')
  startScreenHTML.style.setProperty('display', 'none')
  // на старте показываем поле и header
  levelNowHTML.textContent = level
  muted? volumeButton.src = './assets/img/svg/low-volume.svg': volumeButton.src = './assets/img/svg/high-volume.svg'
  nextLevelPointsHTML.textContent = nextLevelPoints 
  tableHTML.style.setProperty('display', 'unset')
  tableHeadHTML.style.setProperty('display', 'flex')

  document.querySelector('.score-count').textContent = score
  for (let i = 0; i < 8; i++) {
    tableArr.push([]);
    for (let j = 0; j < 8; j++) {
      // меняем значение в массиве чтобы отсутствовали
      // сразу готовые блоки
      do {
        tableArr[i][j] = getRandom();
      } while (is3Match(i, j, tableArr));
    }
  }
  // Заполняем html таблицу согласно полученному массиву
  fillTheTable(tableArr);
  if (!muted) {goSound.play()} 
};

// Проверяем могут не свапаться элементы или нет
const isSwapable = (activeEl, secEl) => {
  // принимает элемент, а не его датасет.cell
  activeEl = activeEl.dataset.cell;
  secEl = secEl.dataset.cell;
  return (
    (Math.abs(activeEl[0] - secEl[0]) == 0 &&
      Math.abs(activeEl[1] - secEl[1]) == 1) ||
    (Math.abs(activeEl[0] - secEl[0]) == 1 &&
      Math.abs(activeEl[1] - secEl[1]) == 0)
  );
};

// Определяем направление свапа (от активного элемента(с классом актив в прошлом))
const defineSwapDirection = (activeEl, secEl) => {
  activeEl = activeEl.dataset.cell;
  secEl = secEl.dataset.cell;
  if (activeEl[0] == secEl[0] && activeEl[1] < secEl[1]) {
    return "right";
  } else if (activeEl[0] == secEl[0] && activeEl[1] > secEl[1]) {
    return "left";
  } else if (activeEl[0] > secEl[0] && activeEl[1] == secEl[1]) {
    return "top";
  } else {
    return "bottom";
  }
};

const swapProbably = (firstActive, secToSwap) => {
  // Возможный новый массив при наличии 3 элементов в ряд после свапа
  let probablyArr = [];
  // делаем глубокую копию массива чтобы не изменять изначальный
  tableArr.map((el) => probablyArr.push([...el]));
  // меняем элементы местами
  let i = firstActive.dataset.cell[0],
    j = firstActive.dataset.cell[1];
  probablyArr[i][j] = diamondsArr.indexOf(secToSwap.classList[1]);
  (i = secToSwap.dataset.cell[0]), (j = secToSwap.dataset.cell[1]);
  probablyArr[i][j] = diamondsArr.indexOf(firstActive.classList[1]);
  // конец смены элементов
  return probablyArr;
  // далее ищем 3 и более сопадений
};

// Убираем класс active у всей таблицы
const removeActiveClass = () => {
  // table.forEach((cell) => cell.classList.remove("active"));
  table.forEach((cell) => cell.classList.remove("animated-box"));
  table.forEach((cell) => cell.classList.remove("in"));
};

table.forEach((cell) =>
  cell.addEventListener("click", (e) => {
    let matchObje = ''
    if (activeElement == -1) {
      if (!muted) {select.play()} 
      activeElement = e.target.dataset.cell;
      // e.target.classList.add("active");
      e.target.classList.add("animated-box");
      e.target.classList.add("in");
    } else {
      let firstActive = document.querySelector(
        `[data-cell="${activeElement}"]`
      );
      let secToSwap = e.target;
      if (isSwapable(firstActive, secToSwap)) {
        // element can be swap
        // если элементы можно поменять местами, меняем их местами
        // и запускаем проверку, появились ли совпадения
        let checkNewArr = swapProbably(firstActive, secToSwap);
        
        matchObje = matchObjectRowColsCount(checkNewArr);
        // получаем объект с индексами элементов которые удостоверяют условию (3 и более в ряд)
        // индексы построчно и по колонкам и их количество (и тех и других)
        // Если после свапа появились 3 и более в ряд элементов
        if (matchObje.rowMatchCount > 0 || matchObje.colMatchCount > 0 ) {
          // матчи есть - меняем исходный массив tableArr
          tableArr = [];
          checkNewArr.map((el) => tableArr.push([...el]));
          switch (defineSwapDirection(firstActive, secToSwap)) {
            case "top":
              firstActive.animate(animateTopSucc, { duration: 250 });
              secToSwap.animate(animateBottomSucc, { duration: 250 });
              break;
            case "bottom":
              firstActive.animate(animateBottomSucc, { duration: 250 });
              secToSwap.animate(animateTopSucc, { duration: 250 });
              break;
            case "left":
              firstActive.animate(animateleftSucc, { duration: 250 });
              secToSwap.animate(animateRightSucc, { duration: 250 });
              break;
            case "right":
              firstActive.animate(animateRightSucc, { duration: 250 });
              secToSwap.animate(animateleftSucc, { duration: 250 });
              break;
          }
          // после замены и анимации заполняем его уже новыми значениями после свапа
          setTimeout(() => {
            fillTheTable(tableArr);
            deleteMatchElement(matchObje)
          }, 250)
          
          
        } else {
          lifeCount--
          mobileLifeCount.textContent = lifeCount
          lifeImg.forEach((img, i) => {
            if (i < 10 - lifeCount) {
              img.style.setProperty('display', 'none')
            }
          })
          if(!muted) {badMove.play()} 
          switch (defineSwapDirection(firstActive, secToSwap)) {
            case "top":
              firstActive.animate(animateTopErr, { duration: 400 });
              secToSwap.animate(animateBottomErr, { duration: 400 });
              break;
            case "bottom":
              firstActive.animate(animateBottomErr, { duration: 400 });
              secToSwap.animate(animateTopErr, { duration: 400 });
              break;
            case "left":
              firstActive.animate(animateLeftErr, { duration: 400 });
              secToSwap.animate(animateRightErr, { duration: 400 });
              break;
            case "right":
              firstActive.animate(animateRightErr, { duration: 400 });
              secToSwap.animate(animateLeftErr, { duration: 400 });
              break;
          }
          if (lifeCount == 0) {
            setTimeout(() => gameOver(), 500) 
          }
        }
        activeElement = -1;
        removeActiveClass();
      } else {
        // если выбран тот же диамант, то убираем селект
        if (firstActive.dataset.cell === secToSwap.dataset.cell) {
          if (!muted) {select.play()}
          activeElement = -1;
          removeActiveClass();
        } else {
          if (!muted) {select.play()}
          removeActiveClass();
          activeElement = e.target.dataset.cell;
          e.target.classList.add("animated-box");
          e.target.classList.add("in");
        }
        
      }
    }
  })
);


// Удаляем матчи, и придаем им эффект фейда
const deleteMatchElement = (matchObj) => {
  if (matchObj.rowMatchCount + matchObj.colMatchCount == 2) {
    score += 50
    if (!muted) {good.play()}
  }
  if (matchObj.rowMatchCount + matchObj.colMatchCount > 2) {
    score += 100
    if (!muted) {excellent.play()}
  }
  let arrAfterFailing = []
  if (matchObj.rowMatchCount > 0) {
    for (let i = 0; i < 8; i++) {
      if (matchObj.rowMatchList[i].length) {
        let arrOfIndexes = matchObj.rowMatchList[i].flat()
        score += arrOfIndexes.length * 10
        document.querySelector('.score-count').textContent = score
        for (let j = 0; j < arrOfIndexes.length; j++) {
          let k = arrOfIndexes[j]
          let elementIndex = `${i}${k}`
          tableArr[i][k] = -1
          document.querySelector(`[data-cell="${elementIndex}"]`).animate(fadeOut, {duration: 250}) 
        }
      }
    }
    if (!muted) {combo.play()}
    let failsNumber = matchObj.colMatchCount * 5 + matchObj.rowMatchCount
    while (failsNumber) {
      arrAfterFailing = checkFalling(tableArr)
      setTimeout(() => fillTheTable(arrAfterFailing), 250)
      failsNumber--
    }
    
  }
  if (matchObj.colMatchCount > 0) {
    for (let i = 0; i < matchObj.colMatchList.length; i++) {
      if (matchObj.colMatchList[i].length) {
        let arrOfIndexes = matchObj.colMatchList[i].flat()
        score += arrOfIndexes.length * 10
        document.querySelector('.score-count').textContent = score
        for (let j = 0; j < arrOfIndexes.length; j++) {
          let k = arrOfIndexes[j]
          let elementIndex = `${k}${i}`
          tableArr[k][i] = -1
          document.querySelector(`[data-cell="${elementIndex}"]`).animate(fadeOut, {duration: 250})
        }
      }
    }
    if (!muted) {combo.play()}
    let failsNumber = matchObj.colMatchCount * 5 + matchObj.rowMatchCount
    while (failsNumber) {
      arrAfterFailing = checkFalling(tableArr)
      setTimeout(() => fillTheTable(arrAfterFailing), 250)
      failsNumber--
    }
  }
  if (score >= nextLevelPoints) {
    setTimeout(() => winLevelUp(), 800)
  } else {
    setTimeout(() => {refillTable(arrAfterFailing)}, 250)
  } 
  
}

const checkFalling = (arr) => {
  for (let j = 0; j < 8; j++) {
    for (let i = 7; i > 0; i--) {
      if (arr[i][j] == -1 && arr[i - 1][j] >= 0) {

        arr[i][j] = arr[i - 1][j];
        arr[i - 1][j] = -1;
        
      }
    }
  }
  return arr
}

const refillTable = (arr) => {
  let matchAfterFill = {}
  let refillableArr = arr.map(el => el.map(n => n == -1? el = getRandom(): n))
  tableArr = []
  refillableArr.map((el) => tableArr.push([...el]));
  fillTheTable(refillableArr)
  matchAfterFill = matchObjectRowColsCount(tableArr)
  setTimeout(() => {
    if (matchAfterFill.rowMatchCount > 0 || matchAfterFill.colMatchCount > 0 ) {
      if (!muted) {combo2.play()}
      deleteMatchElement(matchAfterFill)
    }
    matchAfterFill = {}
  }, 500)
  
  
}


newContinueGameButton.addEventListener('click', () => {
  if (newContinueGameButton.textContent === 'NEW GAME') {
    // делаем id для хранения рекордов игры из подручных средств =)
    // id нужен для того чтобы перезаписывать результат игры для уже существующей
    gameId = Math.floor(Math.random() * 10000) + diamondsArr[Math.floor(Math.random() * 6)][Math.floor(Math.random() * 2)]
    score = 0
    level = 1
    nextLevelPoints = level * level * 300
    startGame(lifeCount)
  } else {
    level += 1
    nextLevelPoints = level * level * 300
    startGame(lifeCount)
  }
})


goToRecordsButtonHTML.addEventListener('click', records)
backToMenuButton.addEventListener('click', backToMenu)
giveUPButton.addEventListener('click', gameOver)
volumeButton.addEventListener('click', () => {
  if (muted) {
    volumeButton.src = './assets/img/svg/high-volume.svg'
    muted = false
  } else {
    volumeButton.src = './assets/img/svg/low-volume.svg'
    muted = true
  }
})
refreshFieldButton.addEventListener('click', refreshField)
alertOkButton.addEventListener('click', () => {
  alertWindow.style.setProperty('display', 'none')
  tableHeadHTML.style.setProperty('display', 'flex')
  tableHTML.style.setProperty('display', 'unset')
})

console.log(`70 / 60
Если Вам понравилась моя игра, отправьте пожалуйста ее в форму лучших работ
Заранее спасибо
https://forms.gle/retrgFivX1ybcVbp9

Как играть:
Игра 3 в ряд, она же Lines, она же Bejeweled
Кристаллы выбираются левым кликом мыши
Менять можно только рядом стоящие по горизонтали либо вертикали
Каждый неверный свап отнимает одну жизнь из общего количества
Успешная комбинация - 3 и более кристаллов стоящих рядом по вертикали либо горизонтали
Если после свапа появилось 2 и более комбинации Вы получаете дополнительные очки,
что сопровождается звуковым эффектом.
Белый флаг - возможность сдаться и закончить игру
Стрелки - возможность сгенерировать новое поле (стоит 1 жизнь)
Можно генерировать новое поле, при условии что жизней у вас 2 и более
Результаты записываются в localStorage
Если записей в таблеце рекордов уже 10, 
то последняя игра всегда записывается в рейтинг, независимо от ее результата,
путем удаления худшего значения из таблицы рекордов
`)