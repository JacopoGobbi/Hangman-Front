$(function() {
  $.getScript("js/hangman.js");
  $.getScript("js/tomcat-settings.js", function() {
    var startNewGame = function(name) {
      $.ajax({
        type: 'POST',
        url: tomcatEndPoint + "/api/game/init",
        data: JSON.stringify({
          sessionCookie: Cookies.get("hangman"),
          playerName: name
        }),
        success: function(data) {
          playerExists(data);
        },
        contentType: "application/json",
        dataType: "json"
      });
    }

    var printUncompletedWord = function(responseData) {
      $("div#word").html("<h1>" +
      responseData.uncompletedWord.split("&nbsp;") +
      "</h1>")
    }

    var printHangman = function(responseData) {
      $("div#hangman").html(hangman[9-responseData.attemptsLeft].replace(/\s/g, "&nbsp;"));
    }

    var printLetters = function() {
      $.each('abcdefghijklmnopqrstuvwxyz'.split(''), function(index, element) {
        $("div#letters").append(
          '<button class="letter" id="' + index + '" value="' + element + '">' + element + '</button>'
        );
        if((index+1) % 9 == 0)
          $("div#letters").append("<br>");
      });
    }

    var printPlayerInfo = function(responseData) {
      $("#playerInfo").html(
        "<br>Player name: " + responseData.playerName +
        "<br>Games won: " + responseData.gamesWon)
    }

    var playerExists = function(successData) {
      responseData = successData.successDTO;
      if(responseData == null) {
        $("body").load("_end.html");
      } else {
        switch(responseData.gameStatus) {
          case "PLAYING":
            $("body").load("_playing.html", function() {
              printUncompletedWord(responseData);
              printHangman(responseData);
              printLetters();
              printPlayerInfo(responseData);
            });
            $("#end").load("_end.html");
            break;
          case "WON":
          case "LOST":
            $("body").load("_playing.html", function() {
              printUncompletedWord(responseData);
              printHangman(responseData);
              printLetters();
              printPlayerInfo(responseData);
              $("#end").load("_end.html", function() {
                $("#end").prepend("You " + responseData.gameStatus);
              });
            });
            break;
          default:
            $("body").load("_end.html");
        }
      }
    }

    var cookie = Cookies.get("hangman");
    var responseData;
    if(cookie) {
      $.ajax({
        type: 'POST',
        url: tomcatEndPoint + "/api/game/status",
        data: JSON.stringify({
          sessionCookie: Cookies.get("hangman")
        }),
        success: function(data) {
          playerExists(data);
        },
        contentType: "application/json",
        dataType: "json"
      });
    } else {
      $("body").load("_start.html");
    }
    
    $(document).on("submit", "form#start", function(e) {
      e.preventDefault();
      Cookies.set("hangman",
        $.now().toString() + $("#playerName").val());
      startNewGame($("#playerName").val());
    });

    $(document).on("submit", "form#restart", function(e) {
      e.preventDefault();
      startNewGame(Cookies.get("hangman").replace(/[0-9]/g, ''));
    });

    $(document).on("click", "button.letter", function() {
      $.ajax({
        type: 'POST',
        url: tomcatEndPoint + "/api/game/play",
        data: JSON.stringify({
          sessionCookie: Cookies.get("hangman"),
          letterAttempt: $(this).val()
        }),
        success: function(data) {
          playerExists(data);
        },
        contentType: "application/json",
        dataType: "json"
      });
    });
  });

});
