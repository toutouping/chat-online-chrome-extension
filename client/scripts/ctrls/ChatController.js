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
    $scope.send = function(content_type){
        if($scope.send_content){
            let obj = {
                userid: $scope.login_user.userid,
                username: $scope.login_user.username,
                content: $scope.send_content,
                content_type: content_type
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
        $scope.send('emotion');
        $scope.emotion_show_flag = false;
    }; 

    //change reminder();
    $scope.change_reminder = function(){
        console.log($scope.reminder);
        chrome.runtime.sendMessage({listen_type:'change_reminder', reminder:$scope.reminder});
    }; 
    
    //read image information
    var imgReader = function( item ){
        var blob = item.getAsFile(),
            reader = new FileReader();
            
        reader.onload = function( e ){
            $scope.image_info = e.target.result;
        };
        reader.readAsDataURL( blob );
    };

    //message_paste();
    $scope.message_paste = function($event){
        //let
        let clipboardData = $event.originalEvent.clipboardData, 
            i = 0, items, item, types;
        
        //if anything can paste
        if( clipboardData ){
            items = clipboardData.items;
            if( !items ){
                return;
            }
            item = items[0];
            types = clipboardData.types || [];  //just the type of data
            for( ; i < types.length; i++ ){
                if( types[i] === 'Files' ){
                    item = items[i];
                    break;
                }
            }

            //just item is img or not
            if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                imgReader( item );  //get imageInfo
                $scope.send_content = $scope.image_info;
                $scope.send('image');
            }
        }
    }; 
    
    //press_key
    $scope.press_key=function($event){
      if($event.keyCode==13){//when press enter, send messages
        $scope.login_show_flag ? $scope.login(): $scope.send();
      }
    }; 
});



