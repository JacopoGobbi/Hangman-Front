$(function() {
  $.getScript("js/tomcat-settings.js", function() {
    var printOut = function(data) {
      if (data.playersDTOs.length == 0) {
        $("div#playersInfo").append("No player present");
      } else {
        $.each(data.playersDTOs, function(index, player) {
          $("div#playersInfo").append('<br>Player id: ' + player.id +
            '<br>Player name: ' + player.name +
            '<br>Games won: ' + player.gamesWon +
            '<br>Games:' +
            '<br><div id="games"></div>')
          if (player.games.length == 0) {
            $("div#games").append("No game present for this player");
          } else {
            $.each(player.games, function(index, game) {
              $("div#games").append('<br>Game id: ' + game.id +
                '<br>Game attempts left: ' + game.attemptsLeft +
                '<br>Game status: ' + game.gameStatus +
                '<br>Letter Attempts: <span id="letterAttempts' + game.id + '"></span><br>');
                $.each(game.letterAttempts, function(index, letterAttempt) {
                  $("span#letterAttempts" + game.id).append(letterAttempt);
                });
            });
          }
        });
      }
    }

    $.ajax({
      type: 'GET',
      url: tomcatEndPoint + "/api/games/show",
      success: function(data) {
        printOut(data);
      },
      contentType: "application/json",
      dataType: "json"
    });
  });
});
