/**
 * Created by cuihandong on 16/06/2017.
 */
var FNode = require("./../src/FNode");

var SlotScene = function(){

    this.leftFreeSpinCount = 0;
    this.winChips = 0;
    this.jackpotTrigger = false;
    this.winlines = null;
    this.leftFreeSpinCount = 0;
}

SlotScene.prototype.build = function() {
    var tree = [
        "loop",
        this.getNextResult,
        {
            switch: this.getRoundType,
            case_freespin: [
                this.onRoundStartInFreeSpin,
                [
                    "loop",
                    this.onSubRoundStartInFreeSpin,
                    this.onSpinStart,
                    this.onSpinEnd,
                    this.onSubRoundEndInFreeSpin,
                    this.checkFreeSpinEnd,
                ],
                this.onRoundEndInFreeSpin,
            ],
            case_normal: [
                this.onRoundStart,
                [
                    this.onSubRoundStart,
                    this.onSpinStart,
                    this.onSpinEnd,
                    this.onSubRoundEnd,
                ],
                this.onRoundEnd,
            ],
        },
        [
            this.checkAndShowBigWin,
            this.checkAndShowJackpot,
            this.checkAndShowAllWinLine,
            this.showEachWinLine,//不阻塞
        ],
        this.waitSpinButton,
    ];
    this.runNode = FNode.build(tree,this,{value:"value1"});
}

SlotScene.prototype.getNextResult = function(next,data){
    console.log("data:",data)
    if(Math.random()>0.9){
        this.leftFreeSpinCount = 1;
    }
    else{
        this.leftFreeSpinCount = 0;
    }
    if(Math.random()>0.5){
        if(Math.random()>0.5) {
            this.winChips = 20000;
        }
        else{
            this.winChips = 1000;
        }
    }
    else{
        this.winChips = 0;
    }
    if(Math.random()>0.9) {
        this.jackpotTrigger = true;
    }else{
        this.jackpotTrigger = false;
    }
    this.winlines = null;

    next({type:FNode.FNodeResultType.Next});
}

SlotScene.prototype.getRoundType = function(next,data){
    console.log("data:",data)
    var res = {};
    res.value = "freespin";
    res.value = "normal";
    res.tyep = FNode.FNodeResultType.Next;
    next(res);
}

SlotScene.prototype.checkFreeSpinEnd = function(next,data){
    console.log("data:",data)
    if(this.leftFreeSpinCount <=0 ){
        next({type:FNode.FNodeResultType.Break});
    }
    else{
        next({type:FNode.FNodeResultType.Next});
    }
}

SlotScene.prototype.onRoundStart = function(next,data){
    console.log("onRoundStart");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onRoundEnd = function(next,data){
    console.log("onRoundEnd");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onRoundStartInFreeSpin = function(next,data){
    console.log("onRoundStartInFreeSpin");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onRoundEndInFreeSpin = function(next,data){
    console.log("onRoundEndInFreeSpin");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}
SlotScene.prototype.onSubRoundStart = function(next,data){
    console.log("onSubRoundStart");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onSubRoundEnd = function(next,data){
    console.log("onSubRoundEnd");
    console.log("data:",data)
    setTimeout(function(){
        // next({type:FNode.FNodeResultType.Next});
        next();//default
    },1000);

}

SlotScene.prototype.onSpinStart = function(next,data){
    console.log("onSpinStart");
    console.log("data:",data)
    setTimeout(function(){
        // next({type:FNode.FNodeResultType.Next});
        next(FNode.FNodeResultType.Next);//simple
    },1000);

}

SlotScene.prototype.onSpinEnd = function(next,data){
    console.log("onSpinEnd");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onSubRoundStartInFreeSpin = function(next,data) {
    console.log("onSubRoundStartInFreeSpin");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onSubRoundEndInFreeSpin = function(next,data) {
    console.log("onSubRoundEndInFreeSpin");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);
}


/////////////////////
SlotScene.prototype.checkAndShowBigWin = function(next,data) {
    console.log("checkAndShowBigWin");
    console.log("data:",data)
    if(this.winChips>10000){
        console.log("show big win");
        setTimeout(function(){
            next({type:FNode.FNodeResultType.Next});
        },1000);
    }
    else{
        console.log("do not show big win");
        next({type:FNode.FNodeResultType.Next});
    }
}

SlotScene.prototype.checkAndShowJackpot = function(next,data) {
    console.log("checkAndShowJackpot");
    console.log("data:",data)
    if(this.jackpotTrigger){
        console.log("show jackpot dialog");
        setTimeout(function(){
            next({type:FNode.FNodeResultType.Next});
        },1000);
    }
    else{
        console.log("do not show jackpot dialog");
        next({type:FNode.FNodeResultType.Next});
    }
}

SlotScene.prototype.checkAndShowAllWinLine = function(next,data) {
    console.log("checkAndShowAllWinLine");
    console.log("data:",data)
    if(this.winChips>0){
        console.log("show all win line");
        setTimeout(function(){
            next({type:FNode.FNodeResultType.Next});
        },1000);
    }
    else{
        console.log("do not show all win line");
        next({type:FNode.FNodeResultType.Next});
    }
}

SlotScene.prototype.showEachWinLine = function(next,data) {
    console.log("showEachWinLine");
    console.log("data:",data)
    if(this.winlines && this.winlines.length>0){
        console.log("show each win line");
        setTimeout(function(){
            next({type:FNode.FNodeResultType.Next});
        },1000);
    }
    else{
        console.log("do not show each win line");
        next({type:FNode.FNodeResultType.Next});
    }
}

SlotScene.prototype.waitSpinButton = function(next,data) {
    console.log("waitSpinButton");
    console.log("data:",data)
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);
}

var test1 = function(){
    var slotScene = new SlotScene();
    slotScene.build()
    slotScene.runNode.run();
}

test1();