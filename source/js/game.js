// Start Initialization Instant Game
FBInstant.initializeAsync().then(function(){

  FBInstant.setLoadingProgress(50);

  FBInstant.startGameAsync().then(function() {

      // Chatbot request player
      FBInstant.player.canSubscribeBotAsync().then(function (yes) {
          if(yes){
            FBInstant.player.subscribeBotAsync().then(function(){
              console.log('Subcribe done');
            }).catch(function(e) {

            });
          }
      }).catch(function(e) {
        console.log('canSubscribeBotAsync' ,e);
      });

      // Get infor of player
      var contextID = FBInstant.context.getID();
      console.log('context_id: '+contextID);

      var contextType = FBInstant.context.getType();
      console.log('context_type: '+contextType);

      var playerName = FBInstant.player.getName();
      console.log('player_name: '+playerName);
      $('#user_nameID').text(playerName);

      var playerPic = FBInstant.player.getPhoto();
      console.log('player_pic: '+playerPic);
      $('#user_imgID').attr('src',playerPic);

      var playerId = FBInstant.player.getID();
      console.log('player_id: '+playerId);


      game.start();
  });

  FBInstant.setLoadingProgress(100);

});

  // Create game object
  var f1 = $('#fruitId1'),
      f2 = $('#fruitId2'),
      f3 = $('#fruitId3'),
      f4 = $('#fruitId4'),
      all_fruit = $('.sin_fruit'),
      score = 0,
      open1 = 0,
      life = 5,
      life_text = $('#lifeId'),
      score_text = $('#scoreId'),
      footer = $('#footer'),
      min = 5,
      image,
      max = 80,
      game_over = false,
      topMin = 20,
      anim_id,
      initial_top_position = parseInt(all_fruit.css('top')),
      speed = 1,

      toprandom1 = Math.random() * (+max - +topMin) + +topMin,
      toprandom2 = Math.random() * (+max - +topMin) + +topMin,
      toprandom3 = Math.random() * (+max - +topMin) + +topMin,
      toprandom4 = Math.random() * (+max - +topMin) + +topMin,

      random = Math.random() * (+max - +min) + +min,
      random1 = Math.random() * (+max - +min) + +min,
      random2 = Math.random() * (+max - +min) + +min;
      random3 = Math.random() * (+max - +min) + +min;

      f1.css('left',random+'%');
      f2.css('left',random1+'%');
      f3.css('left',random2+'%');
      f4.css('left',random3+'%');

      f4.css('top',toprandom1+'%');
      f3.css('top',toprandom2+'%');
      f2.css('top',toprandom3+'%');
      f1.css('top',toprandom4+'%');


      setScore();
      function setScore(){
        // Create key in cloud storage of the current player
        FBInstant.player.getDataAsync(['score']).then(data=>{
          $('#best_score').val(data['score']);

          if(!data['score'] || score > data['score']){
            // Set value for key 
             FBInstant.player.setDataAsync({score: score,}).then(function(){
               console.log('data is set');
             });
          }

        });
      }


      getScore();
      function getScore(){
        FBInstant.player.getDataAsync(['score']).then(data=>{
          showhighScore(data['score']);
        });
      }
      function showhighScore(scr){
        $('#best_score_id').text('Best Score: '+scr);
      }


      function shareClick(){
        FBShare(score,image);
      }

      // Share game on facebook
      function FBShare(scr,img){
        let name = FBInstant.player.getName();
        
        var url = "source/img/pika.jpg";
        var img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = function(){
            var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d');
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            base64Picture = canvas.toDataURL("image/png");
            FBInstant.shareAsync({
              intent: "SHARE",
              image: base64Picture,
              text: name + " raced for " + scr + "feet! Let's play this !",
            }).then(function(){
              console.log("share success");
            });
        }

        img.src = url;
      }


      // Invite game to friends
      function FBChoose(){
        FBInstant.context.chooseAsync().then(function(){
          window.FBInstant.updateAsync({
            action: "CUSTOM",
            cta: "Play",
            template: "play_turn",
            image: image,
            text: "Is your turn! Play game",
            data: {
              myReplayData: "...."
            },
            strategy: "IMMEDIATE",
            notification: "NO_PUSH"
          }).then(function(){
            // window.FBInstant.quit();
          }).catch(function(err){
            console.error(err);
          });
        });
      }

      // Both start and restart game
      function restart(){
        life = 5;
        speed = 1;
        score = 0;
        open1 = 1;
        score_text.text(score);
        game_play();
        game_over = false;
        f1.css('left',random+'%');
        f2.css('left',random1+'%');
        f3.css('left',random2+'%');
        f4.css('left',random3+'%');

        f4.css('top',toprandom1+'%');
        f3.css('top',toprandom2+'%');
        f2.css('top',toprandom3+'%');
        f1.css('top',toprandom4+'%');

        anim_id = requestAnimationFrame(game_play);
        $('#opacity_back').css('display', 'none');
        $('.user_info').css('display','none');
        $('.game_over_local_content').css('display','none');
        $('.score').css('display','block');
        $('.game_play_content').css('display','none');
      }

      // Game play 
      function game_play(){
        fruit_dwon(f1);
        fruit_dwon(f2);
        fruit_dwon(f3);
        fruit_dwon(f4);
        collision_check(f1);
        collision_check(f2);
        collision_check(f3);
        collision_check(f4);
        anim_id = requestAnimationFrame(game_play);

        if(open1==0){
          life_text.text('Game Over');
          cancelAnimationFrame(anim_id);
          game_over = true;
          $('#opacity_back').css('display', 'block');
          $('.user_info').css('display','block');
          $('.game_over_local_content').css('display','none');
          $('.score').css('display','none');
          $('.game_play_content').css('display','block');
        }

        if(life>0){
          life_text.text(life);
        }else{
          life_text.text('Game Over');
          cancelAnimationFrame(anim_id);
          game_over = true;
          $('.game_over_score').text('SCORE :'+score);
          $('#opacity_back').css('display', 'block');
          $('.user_info').css('display','block');
          $('.game_over_local_content').css('display','block');
          $('.score').css('display','none');
          setScore();
          getScore();
        }
      }

  
      function fruit_dwon(fruit){
        var corrent_top_position = parseInt(fruit.css('top'));
        fruit.css('top',corrent_top_position+speed);
      }

      anim_id = requestAnimationFrame(game_play);

      function collision_check(fruit){
        if(collision(footer,fruit)){
          var toprandaa = Math.random() * (+max - +topMin) + +topMin;
          fruit.css('top','-'+toprandaa+'%');
          var randau = Math.random() * (+max - +min) + +min;
          fruit.css('left',randau+'%');
          life--;
          $('#curr_score').val(score);

          // End game and save data
          if(life==0){
            gameOver();
          }

        }
      }

      all_fruit.hover(function(){
        if(game_over == false){
          var toprandom = Math.random() * (+max - +topMin) + +topMin;
          $(this).css('top','-'+toprandom+'%');
          var random = Math.random() * (+max - +min) + +min;
          $(this).css('left',random+'%');
          score = score + 1;
          score_text.text(score);
          if(score%10==0){
            speed=speed+.3;
          }
        }
      });

      function collision($div1, $div2){
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2 ) return false;
        return true;
      }

      
      function gameOver(){
        var contextID = FBInstant.context.getID();
        var scrr_score = $('#curr_score').val();

        // Create Leaderboard
        FBInstant.getLeaderboardAsync('TestGame.'+contextID).then(leaderboard => {
          console.log(leaderboard.getName());
          return leaderboard.setScoreAsync(scrr_score);
        })
          .then(() => console.log('Score saved'))
          .catch(error => console.error(error));


        // Get Data Leaderboard
        FBInstant
        .getLeaderboardAsync('TestGame.' +contextID)
        .then(leaderboard => leaderboard.getEntriesAsync(10, 0))
        .then(entries => {
          for (var i = 0; i < entries.length; i++) {
            console.log(
              entries[i].getRank() + '. ' +
              entries[i].getPlayer().getName() + ': ' +
              entries[i].getScore()
            );
          }
        }).catch(error => console.error(error));


        // Update Leaderboard
        FBInstant.updateAsync({
          action: 'LEADERBOARD',
          name: 'TestGame.'+contextID,
        })
          .then(() => console.log('Update Posted'))
          .catch(error => console.error(error));


        // Set custom data for bot
        var imgarr = ['https://www.kaspersky.com/content/en-global/images/repository/isc/2020/9910/a-guide-to-qr-codes-and-how-to-scan-qr-codes-2.png','https://vinacheck.vn/media/2019/05/ma-qr-code_vinacheck.vm_001.jpg','https://miro.medium.com/max/990/1*PNniLVIC_Hc7gNIxjvWPWg.png'];
        var imgrand = imgarr[Math.floor(Math.random() * imgarr.length)];

        FBInstant.setSessionData({
          scoutScore:scrr_score,
          scoutImg:imgrand,
        });


        // Get data and save to database
        function saveData(){
          let user_name = FBInstant.player.getName();
          let user_ava = FBInstant.player.getPhoto();
          let user_score = scrr_score;
          let user_best = $('#best_score').val();
      
          console.log(user_name,user_ava,user_score,user_best);

          $.ajax({
            url:"https://game.breadntea.vn/testgame/save_data.php",
            method:"POST",
            dataType:"json",
            data:{userName:user_name, userAva:user_ava, userScore:user_score, userBest:user_best},
          }).done(function(){
            
          });
        }
        saveData();
      }


  
