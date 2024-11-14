function prepareGameUI(){
    animateCSS("body", "fadeOut").then(() => {
        $("body").hide();
        updateCurrentCommand();

        nextRound();
    
        // Обновляем и показываем таблицу счёта
        refreshScoresTable();
        $("table.scores").show();
    
        // Показываем игровое поле
        $(".commands-area").hide();
        $(".game-field").show();
        $(".game-field").fadeIn(250);

        $("body").show();
        animateCSS("body", "fadeIn");
    });
}

function closeDialog(){
    // Закрыть диалог
    $("dialog")[0].close();
    $("dialog").hide();
    stopClocksInterval();
}

function showAnswer(){
    // Показать ответ и нужные кнопки
    $("dialog h3").show();
    $("dialog .show-answer").hide();
    $("dialog .right").show();
    $("dialog .wrong").show();
    stopClocksInterval();
}

function showDialog(title, description, answer){
    // Сбрасываем состояние диалога
    $("dialog h1").text(title);
    $("dialog h2").text(description);
    $("dialog h3").text(answer);
    $("dialog .right, dialog .wrong").hide();
    $("dialog .show-answer").show();
    $("dialog h3").hide();
    $("#dialog-timer").text("01:00");
    setClocksInterval();
    // Показываем диалог
    $("dialog").show();
    $("dialog")[0].showModal();
}

function updateCurrentCommand(){
    // Обновляем статус игры
    $(".game-status").text(`Сейчас играет: Команда ${commandsData[lastCommandId].name}`);
}

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);
  
      node.classList.add(`${prefix}animated`, animationName, `${prefix}faster`);
  
      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName, `${prefix}faster`);
        resolve('Animation ended');
      }
  
      node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });