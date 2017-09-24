/**
    MIT License

    Copyright (c) 2017 EOF

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

 * Author   : EOF
 * Email    : jasonleaster@gmail.com
 * File     : training.js
 * Date     : 2017/09/24.
 */

define(['js/ai/player', 'libs/async.min'], function(Player, async) {

    var TrainingModule = function() {
        var MAX_ITER_TIMES = 1000;
        var ACCEPT_ERROR_RATE = 0.1;
        var errorRate = 1.0;
        var iterationTimes = 0;

        var players = [];

        debugger;

        var executeGenome = function(player, next) {
             player.playGame(next);
        }

        function iterationExucutor() {

            console.log('Executing generation ' + iterationTimes++);

            //2. 每个玩家玩游戏(串行)，对结果进行评分
            async.mapSeries(players, executeGenome, function() {
                    // 最后处理函数
                    // 3. 只保留得分Top2的玩家
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

                    if (players.length > 1) {
                        iterationExucutor();
                    }
                }
            );
        }

        this.training = function() {

            //1. 创建10个新玩家(神经网络)，初始状态随机
            for (var i = 0; i < 1; i++) {
                players.push(new Player("player" + i));
            }

            iterationExucutor();
        };
    };

    return TrainingModule;
});