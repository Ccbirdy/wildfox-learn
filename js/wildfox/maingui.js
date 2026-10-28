/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//TODO: use jquery API do ajax request
var UserInfo = {
    userId:"",
    right:"",
    score:""
};
$().ready(function(){  
   showMainExplorer();
});

var normalizeSgfUrl = function(serverPath){
    return (serverPath || '').replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/^\/+/, '');
};

var loadRootExplorer = function(){
    loadSgfDirectory('resource/sgf');
};

var loadSgfDirectory = function(pathName){
    if (!pathName || pathName === '') {
        pathName = 'resource/sgf';
    }
    pathName = normalizeSgfUrl(pathName);
    $.ajax({
        url:"./src/main.php",
        type:"GET",
        data:{
            action:"getFileList",
            pathName: pathName
        },
        dataType:"json",
        timeout:"10000",
        success:function(data){
            if (data == undefined || data.body == undefined || data.body.fileList == undefined) {
                showMessage("错误","读取棋谱目录失败。");
                return;
            }
            var folderList = $("#sgfFolderList");
            var fileList = $("#sgfFileList");
            folderList.empty();
            fileList.empty();

            if (pathName !== 'resource/sgf') {
                var upButton = $('<button type="button" style="display:block; margin-bottom:10px; padding:6px 10px; cursor:pointer;">返回上一级</button>');
                upButton.click(function(){
                    var parentPath = pathName.split('/');
                    parentPath.pop();
                    var parent = parentPath.join('/');
                    if (!parent || parent === '') {
                        parent = 'resource/sgf';
                    }
                    loadSgfDirectory(parent);
                });
                folderList.append(upButton);
            }

            for (var i = 0; i < data.body.fileList.length; i++) {
                (function(){
                    var item = data.body.fileList[i];
                    if (!item) return;
                    var fullPath = pathName + '/' + item;
                    var btn = $('<button type="button" style="display:block; width:100%; text-align:left; margin-bottom:6px; padding:8px 10px; cursor:pointer;">' + item + '</button>');
                    btn.click(function(){
                        var urlPath = normalizeSgfUrl(fullPath);
                        var isSgfFile = /\.sgf$/i.test(item);
                        if (isSgfFile) {
                            loadEidogo('player-container', urlPath);
                        } else {
                            loadSgfDirectory(fullPath);
                        }
                    });

                    if (/\.sgf$/i.test(item)) {
                        fileList.append(btn);
                    } else {
                        folderList.append(btn);
                    }
                })();
            }

            if (fileList.children().length === 0 && folderList.children().length === 0) {
                fileList.append('<div style="color:#999;">当前目录没有可用棋谱。</div>');
            }
        },
        error: function(){
            showMessage("错误","读取棋谱目录失败。请确认路径存在。");
        }
    });
};

var showMainExplorer = function(){
    $("#loginPanel").hide();
    $("#contentPanel").show();
    $("#sgfExplorer").show();
    loadRootExplorer();
};

$().ready(function(){  
   showMainExplorer();
});

$(':submit[name="loginSubmit"]').click(function() { 
   showMessage('info','clicked'); 
});
var doLogin = function(){
  var userId = $("#userInput").val();
  var pwd = $("#pwdInput").val();
  $.ajax({
        url:"./src/main.php",
        type:"GET",
        data:{
            action:"getUserInfo",
            userId:userId,
            pwd: pwd
        },
        dataType:"json",
        timeout:"10000",    	
        success:function(data){	    	
            if (data==undefined ||data.body.userInfo == undefined){
                showMessage("错误","请求数据失败。");
                return;
            }else{
                if(data.status == "0000"){
//                    UserInfo.userId = data.body.userInfo.userId;
//                    UserInfo.right = data.body.userInfo.right;
//                    UserInfo.score = data.body.userInfo.score;
                    $("#loginPanel").hide();
                    $("#contentPanel").show();
                }else{
                    showMessage("错误","输入的用户名或者密码错误，请确认后重试。");
                    return;
                }
            }
        },
        error: function(){
            showMessage("错误","请求数据失败。");
        }
    });
};

var changePanel = function(panelName,subClass){
    if(panelName == ''){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
    }else if (panelName=='mainPanel'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
    }else if (panelName == 'selfIgoManual'){
        $("#selfIgoManual").show();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
//        showConvas();
        getFileList('selfIgoManual','../resource/sgf/IgoManual/selfIgoManual');
    }
    else if(panelName == 'professionalIgoManual'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").show();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
        getFileList('professionalIgoManual','../resource/sgf/IgoManual/professionalIgoManual');
//        loadEidogo("player-container","resource/sgf/blood_vomit.sgf");
    }else if(panelName == 'igoManualGame'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").show();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
    }else if(panelName == 'liveAndDie'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").show();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
        var subPath = "";
        if(subClass == "liveAndDie"){
            
        }else if(subClass == "arrangement"){
            
        }else if(subClass == "curcia"){
            
        }else if(subClass == "guanzi"){
            
        }else {
            
        }
        getFileList(subClass,"../resource/sgf/"+subClass);
    }else if(panelName == 'vedioClasss'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").show();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
        if(subClass == "arrangement"){
            
        }else if(subClass == "fight"){
            
        }else if(subClass == "guanzi"){
            
        }else{
            
        }
    }else if(panelName == 'games'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").show();
        $("#scoreManagement").hide();
        $("#userManagement").hide();
        if(subClass == "luobo"){
            
        }else if(subClass == "snowGround"){
            
        }else{
            
        }
    }else if(panelName == 'scoreManagement'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").show();
        $("#userManagement").hide();
    }else if(panelName == 'userManagement'){
        $("#selfIgoManual").hide();
        $("#professionalIgoManual").hide();
        $("#igoManualGame").hide();
        $("#liveAndDie").hide();
        $("#arrangement").hide();
        $("#crucia").hide();
        $("#vedioClasss").hide();
        $("#games").hide();
        $("#scoreManagement").hide();
        $("#userManagement").show();
    }
};

var showConvas = function(){
    var container = Quark.getDOM("slftIgoManualLeftPanel");
    container.style.background = "url(images/IgoBoard.jpg) repeat-x";
    var canvas = Quark.createDOM("canvas", {width:480, height:320, style:
        {
            position:"absolute",
            backgroundColor:"#fff"
        }
    });
    container.appendChild(canvas);
//    var canvasContext = new Quark.CanvasContext({
//        canvas:canvas
//    });
}

var getFileList = function(type,path){
    var pathName = path;
    var htmlStr = "";
    var divListComp;
    if(type == 'selfIgoManual'){        
        htmlStr = "棋谱列表<ul id='qipuList'>";
        divListComp = $("#selfIgoManualList");
    }else if (type == 'professionalIgoManual'){        
        htmlStr = "棋谱列表<ul id='qipuProList'>";
        divListComp = $("#proIgoManualList");
    }else if(type == 'liveAndDie'){        
        htmlStr = "习题列表<ul id='liveAndDieUlList'>";
        divListComp = $("#liveAndDieList");
    }else if(type == 'arrangement'){        
        htmlStr = "习题列表<ul id='arrangementUlList'>";
        divListComp = $("#arrangementList");
    }else if(type == 'curcia'){
        
    }else if(type == 'guanzi'){
        
    }
    
    $.ajax({
        url:"./src/main.php",
        type:"GET",
        data:{
            action:"getFileList",
            pathName: pathName
        },
        dataType:"json",
        timeout:"10000",    	
        success:function(data){
            if (data==undefined ||data.body.fileList == undefined){
                showMessage("错误","请求数据失败。");
                return;
            }else{
                if(data.status == "0000"){
                    for(var i=0; i<data.body.fileList.length;i++){
                        if(data.body.fileList[i] != undefined)
                            htmlStr = htmlStr + "<li><a onclick='getFileList(\""+type+"\",\""+pathName+"/"+data.body.fileList[i]+"\");'>"+data.body.fileList[i]+"</a></li>";
                    }
                    htmlStr =  htmlStr+"</ul>";
                    
                    divListComp[0].innerHTML = htmlStr;
                    if(type == 'selfIgoManual'){
                        $("#qipuList").puislidemenu();
                    }else if (type == 'professionalIgoManual'){
                        $("#qipuProList").puislidemenu();
                    }else if (type == 'liveAndDie'){                                              
                        $("#liveAndDieUlList").puislidemenu();
                    }else if (type == 'arrangement'){
                        $("#arrangementUlList").puislidemenu();
                    }
                    

                }else{
                    showMessage("错误","输入的用户名或者密码错误，请确认后重试。");
                    return;
                }
            }
        },
        error: function(){
            showMessage("错误","请求数据失败。");
        }
    });
}

var openSGF = function(s){
     $.ajax({
        url:"./src/main.php",
        type:"GET",
        data:{
            action:"getFileList",
            pathName: s
        },
        dataType:"json",
        timeout:"10000",    	
        success:function(data){
            
        },
        error: function(){
            showMessage("错误","请求数据失败。");
        }
     });
}

var doSendSGFString = function (){
    
};

var doGetSGFString = function (){
    
};
            
var showUploadForm = function(){
    
};

var showProlemForm = function (){
    
};

var showQipuForm = function (){
    
};

var showLoginForm = function (){
    
};

var testStorage = function(){
    if(window.localStorage){
        showMessage('Info','This browser supports localStorage');
    }else{
        showMessage('Info','This browser does NOT support localStorage');
    }
}

var initEidogo = function(){
    var player = new eidogo.Player({
        container:       "player-container", // HTML element id indicating where to put the player
        theme:           "standard", // "standard" or "compact"
        sgfUrl:          "resource/sgf/blood_vomit.sgf", // relative URL (within same domain) to SGF file to load 
        loadPath:        [0, 0], // The location within the game tree to start at
        mode:            "play", // "play" or "view"
        showComments:    true,
        showPlayerInfo:  true,
        showGameInfo:    true,
        showTools:       true,
        showOptions:     true,
        markCurrent:     true,
        markVariations:  true,
        markNext:        false,
        enableShortcuts: false,
        problemMode:     false
    });
}

var loadEidogo = function(containerID, sgfPath){
    $.ajax({
        url:"./src/main.php",
        type:"GET",
        data:{
            action:"getSgfText",
            pathName: sgfPath
        },
        dataType:"json",
        timeout:"20000",
        success:function(data){
            if (data == undefined || data.body == undefined || data.body.sgf == undefined) {
                showMessage("错误","读取棋谱内容失败。");
                return;
            }
            var player = new eidogo.Player({
                container:       containerID,
                theme:           "standard",
                sgf:             data.body.sgf,
                loadPath:        [0, 0],
                mode:            "play",
                showComments:    true,
                showPlayerInfo:  true,
                showGameInfo:    true,
                showTools:       true,
                showOptions:     true,
                markCurrent:     true,
                markVariations:  true,
                markNext:        false,
                enableShortcuts: false,
                problemMode:     false
            });
        },
        error: function(){
            showMessage("错误","读取棋谱内容失败，请确认 SGF 文件格式正确。");
        }
    });
}

artDialog.notice = function (options) {
    var opt = options || {},
        api, aConfig, hide, wrap, top,
        duration = 800;
        
    var config = {
        id: 'Notice',
        left: '50%',
        top: '90%',
        fixed: true,
        drag: false,
        resize: false,
        follow: null,
        lock: false,
        init: function(here){
            api = this;
            aConfig = api.config;
            wrap = api.DOM.wrap;
            top = parseInt(wrap[0].style.top);
            hide = top + wrap[0].offsetHeight;
            
            wrap.css('top', hide + 'px')
                .animate({top: top + 'px'}, duration, function () {
                    opt.init && opt.init.call(api, here);
                });
        },
        close: function(here){
            wrap.animate({top: hide + 'px'}, duration, function () {
                opt.close && opt.close.call(this, here);
                aConfig.close = $.noop;
                api.close();
            });
            
            return false;
        }
    };	
    
    for (var i in opt) {
        if (config[i] === undefined) config[i] = opt[i];
    };
    
    return artDialog(config);
};

var showMessageFloat = function(title,message){
    art.dialog.notice({
	    title: title,
	    width: 220,
	    content: message,	    
	    time: 5
    });
}

var showMessage = function (title,message){
    art.dialog({
        title: title,
        content: message,
        cancelVal: '关闭',
        cancel:true
    });
}
