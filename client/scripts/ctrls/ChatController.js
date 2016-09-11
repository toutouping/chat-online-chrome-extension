"use strict";

main_app.controller('ChatController',($scope,$window)=>{ 
    $scope.login = function(){ 
        $scope.main_show_flag = true;
        $scope.login_show_flag = false;   

        let genUid = function(){
            return new Date().getTime()+""+Math.floor(Math.random()*899+100);
        }; 
        $scope.login_user.userid = genUid();  

        //Tell to server that one person want to login
        chrome.runtime.sendMessage({listen_type:'login', login_user:$scope.login_user});  
    };  

    //logout
    $scope.logout = function(){  
        $scope.main_show_flag = false;
        $scope.login_show_flag = true;
        //To determine whether login or not 
        chrome.runtime.sendMessage({listen_type:'logout'},(response)=>{
            $window.location.reload(); 
        });
    }; 

     //send messages
    $scope.send = function(emotion_flag){
        if($scope.send_content){
            let obj = {
                userid: $scope.login_user.userid,
                username: $scope.login_user.username,
                content: $scope.send_content,
                emotion_flag: emotion_flag
            };  
        chrome.runtime.sendMessage({listen_type:'send', send_obj:obj});
        $scope.send_content = '';  //clear Input box
       }
    };  


    //emotion show
    $scope.emotion_show = function(){
        $scope.emotion_show_flag = $scope.emotion_show_flag ? false:true;
    };


    //send emotion    
    $scope.send_emotion = function(emotion){
        $scope.send_content = '<div class="icon-emo"><i class="demo-icon icon-emo-happy">'+emotion+'</i></div>';
        $scope.send(true);
        $scope.emotion_show();
    }; 

    $scope.login_by_key=function($event){
      if($event.keyCode==13){//when press enter, send messages
          $scope.send();
      }
    }; 

    $scope.send_by_key=function($event){
      if($event.keyCode==13){//when press enter, send messages
          $scope.send();
      }
    }; 
});



