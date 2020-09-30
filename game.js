$(document).ready(function() {

  var SimonController = (function() {

    var data = {
      colorBtnArray: ["green", "red", "yellow", "blue"],
      simonOrderArray: [],
      userBtnPressOrder: []
    };

    var simonStoreSequence = function(btnColor, arrayType) {
      data[arrayType].push(btnColor);
      console.log(data);
    };

    var verifyOrder = function() {
      if (data.simonOrderArray.length != data.userBtnPressOrder.length) {
        return false;
      } else {
        for (var i = 0; i < data.simonOrderArray.length; i++) {
          if (data.simonOrderArray[i] != data.userBtnPressOrder[i]) {
            return false;
          }
        }
        return true;
      }
    };

    var ResetArray = function(arrayName) {
      data[arrayName] = [];
      console.log(data);
    }

    return {
      addItemTobtnArray: function(color) {
        simonStoreSequence(color, "simonOrderArray");
      },
      addItemToUsrBtnArray: function(color) {
        simonStoreSequence(color, "userBtnPressOrder");
      },
      getColorArray: function(index) {
        return data.colorBtnArray[index];
      },
      checkOrderForSound: function() {
        return verifyOrder();
      },
      EmptyArrayAll: function() {
        data.simonOrderArray = [];
        data.userBtnPressOrder = [];
      },
      EmptyArray: function(arrayName) {
        ResetArray(arrayName);
      },
      getArrayLength: function() {
        return (data.simonOrderArray.length == data.userBtnPressOrder.length) ? "true" : "false";
      }
    }
  })();

  var UIController = (function() {
    var DOMString = {
      addHeader: "#level-title",
      getBody: "body",
      keyPressed: "pressed",
      gameOver: "game-over",
      divButton: "btn"
    };
    var playAudio = function(audioTrack) {
      var audio = new Audio("sounds/" + audioTrack + ".mp3");
      audio.play();
    }
    var btnPressed = function(className) {
      $("." + className).addClass(DOMString.keyPressed);
      setTimeout(function() {
        $("." + className).removeClass(DOMString.keyPressed);
      }, 200);
      //  SimonController.addItemToUsrBtnArray(className);
    }
    return {
      getButtons: function() {
        return DOMString.divButton;
      },
      updateHeader: function(textData) {
        //document.querySelector(addHeader).textContent = textData
        $(DOMString.addHeader).text(textData);
      },
      changeBackgrountonGameOver: function() {
        //document.querySelector(getBody).classList.add(gameOver)
        $(DOMString.getBody).addClass(DOMString.gameOver);
      },
      changeBackgrountonGameStart: function() {
        //document.querySelector(getBody).classList.remove(gameOver)
        $(DOMString.getBody).removeClass(DOMString.gameOver);
      },
      changeBtnCssOnPressed: function(btnClass) {
        //document.querySelector(btnClass).classList.add(keyPressed)
        btnPressed(btnClass);
      },
      playAudioRandomly: function() {
        var randomNumber = Math.floor(Math.random() * 4);
        var randomBtnColor = SimonController.getColorArray(randomNumber);
        playAudio(randomBtnColor);
        return randomBtnColor;
      },
      playAudio: function(sound) {
        playAudio(sound);
      }
    }
  })();

  var mainController = (function() {
    var btnClass = UIController.getButtons();
    var addEventListeners = {
      btnEvt: function() {
        //  $("." + btnClass).click(function(){
        var selection = document.getElementsByClassName(btnClass);

        for (var i = 0; i < selection.length; i++) {
          selection[i].addEventListener('click', btnHandler);
        }
      },
      domEvt: function() {
        //$(document).keypress(function() {
        document.addEventListener('keypress', domHandler);
        document.addEventListener('touchstart',domHandler);
      }
    };

    var rmvEvtListener = {
      domEvt: function() {
        document.removeEventListener('keypress',domHandler);
        document.removeEventListener('touchstart',domHandler);
      },
      btnEvt: function() {
        //$(btnClass).off();
        var ele=document.getElementsByClassName('btn');
        for(var i=0;i<ele.length;i++){
          ele[i].removeEventListener("click",btnHandler);
        }
      }
    }

    function btnHandler() {
      var thisClassColor = this.getAttribute("class").split(' ')[1];
      UIController.changeBtnCssOnPressed(thisClassColor);
      UIController.playAudio(thisClassColor);
      SimonController.addItemToUsrBtnArray(thisClassColor);
      nextSequence();
      //nextSequence();
    }

    function domHandler() {
      UIController.changeBackgrountonGameStart();
      UIController.updateHeader("Game Started");
      randomBtnPress();
      rmvEvtListener.domEvt();
      //  nextSequence();

    }
    var randomBtnPress = function() {
      var randomBtnColor = UIController.playAudioRandomly();
      UIController.changeBtnCssOnPressed(randomBtnColor);
      console.log("from DOM evt " + randomBtnColor);
      SimonController.addItemTobtnArray(randomBtnColor);

      SimonController.EmptyArray("userBtnPressOrder");
      addEventListeners.btnEvt();
    }
    var nextSequence = function() {
    //  var myVar;
      if (SimonController.checkOrderForSound()) {
        rmvEvtListener.btnEvt();
        setTimeout(randomBtnPress, 1000);
      } else if (SimonController.getArrayLength() == "true") {
        rmvEvtListener.btnEvt();
        rmvEvtListener.domEvt();
        UIController.changeBackgrountonGameOver();
        UIController.updateHeader("Press a key to start the game");
        SimonController.EmptyArrayAll();
        addEventListeners.domEvt();
      }
      //clearTimeout(myVar);
    }

    return {
      init: function() {
        console.log("application started");
        addEventListeners.domEvt();
      },
      RemoveEvt: {
        rmvDomEvt: function() {
          rmvEvtListener.domEvt();
        },
        rmvBtnEvt: function() {
          rmvEvtListener.btnEvt();
        }
      },
      AddEvent: {
        addBtnEvt: function() {
          addEventListeners.btnEvt();
        },
        addDomEvt: function() {
          addEventListeners.domEvt();
        }
      }
    }
  })();
  mainController.init();
})
