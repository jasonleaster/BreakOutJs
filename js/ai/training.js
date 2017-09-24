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

define(['js/ai/smartplayer', 'libs/async.min'], function(Player, async) {

    var TrainingModule = function() {
        var MAX_ITER_TIMES = 1000;
        var ACCEPT_ERROR_RATE = 0.1;
        var errorRate = 1.0;
        var iterationTimes = 0;

        var players = [];

        debugger;

        var crossOver = function (netA, netB) {
          // Swap (50% prob.)
          if (Math.random() > 0.5) {
            var tmp = netA;
            netA = netB;
            netB = tmp;
          }

          // Clone network
          netA = _.cloneDeep(netA);
          netB = _.cloneDeep(netB);

          // Cross over data keys
          crossOverDataKey(netA.neurons, netB.neurons, 'bias');

          return netA;
        }


        // Given an Array of objects with key `key`,
        // and also a `mutationRate`, randomly Mutate
        // the value of each key, if random value is
        // lower than mutationRate for each element.
        var mutateDataKeys = function (a, key, mutationRate){
          for (var k = 0; k < a.length; k++) {
            // Should mutate?
            if (Math.random() > mutationRate) {
              continue;
            }

            a[k][key] += a[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
          }
        }

        // Does random mutations across all
        // the biases and weights of the Networks
        // (This must be done in the JSON to
        // prevent modifying the current one)
        var mutate = function (net){
          // Mutate
          mutateDataKeys(net.neurons, 'bias', 0.4);
          
          mutateDataKeys(net.connections, 'weight', 0.4);

          return net;
        }

        // Given an Object A and an object B, both Arrays
        // of Objects:
        // 
        // 1) Select a cross over point (cutLocation)
        //    randomly (going from 0 to A.length)
        // 2) Swap values from `key` one to another,
        //    starting by cutLocation
        var crossOverDataKey = function (a, b, key) {
          var cutLocation = Math.round(a.length * Math.random());

          var tmp;
          for (var k = cutLocation; k < a.length; k++) {
            // Swap
            tmp = a[k][key];
            a[k][key] = b[k][key];
            b[k][key] = tmp;
          }
        }

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
                    var bestPlayer = players[0];
                    if (players.length > 1) {
                        var playA = players[0];
                        var playB = players[1];
                        mutate(crossOver(playA.getNet(), playerB.getNet()));

                        iterationExucutor();
                    } else if (players.length == 1 && players[0].getScore() < 200) {
                        mutate(crossOver(bestPlayer.getNet(), bestPlayer.getNet()));
                        iterationExucutor();
                    } else {
                        console.log("Training finished! Best Score: " + bestPlayer.getScore());
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