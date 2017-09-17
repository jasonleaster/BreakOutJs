require(['js/ai/player'], function (Player) {

    var MAX_ITER_TIMES = 1000;
    var ACCEPT_ERROR_RATE = 0.1;
    var errorRate = 1.0;

    var players = [];

    var started = false;
    for (var i = 0; i < MAX_ITER_TIMES && errorRate > ACCEPT_ERROR_RATE; i++) {
        if (!started) {
             //1. 创建10个新玩家(神经网络)，初始状态随机
            started = true;
            for (var n = 0; n < 10; n++) {
                players.push(new Player());
            }
        } else {
            // 1. 从剩余的玩家中复制出8个新的玩家，随机改变其中某个参数
        }
        
        //2. 每个玩家并行的玩游戏，对结果进行评分
        for (var n = 0; n < players.length; n++) {
            var player = players[n];
            player.startGame();
        }

        // 3. 等待所有玩家游戏结束
        for (var n = 0; n < players.length; n++) {
            var player = players[n];
            while (!player.gameOver()) {
                // yeild to other thread.
            }
            console.log(player.getPlayerName() + ": game finished!");
        }

        // 4. 只保留得分Top2的玩家
        for (var n = 0; n < players.length; n++) {
            for (var m = n + 1; m < players.length; m++) {
                if (players[n].getScore() > players[m].getScore()) {
                    var tmp = players[n];
                    players[n] = players[m];
                    players[m] = tmp;
                }
            }
        }

        for (var n = 0; n < players.length - 2; n++) {
            players.pop();
        }
    }
});