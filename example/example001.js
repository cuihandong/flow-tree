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
    this.runNode = FNode.build(tree,this);
}

SlotScene.prototype.getNextResult = function(next){

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

SlotScene.prototype.getRoundType = function(next){
    var res = {};
    res.value = "freespin";
    res.value = "normal";
    res.tyep = FNode.FNodeResultType.Next;
    next(res);
}

SlotScene.prototype.checkFreeSpinEnd = function(next){
    if(this.leftFreeSpinCount <=0 ){
        next({type:FNode.FNodeResultType.Break});
    }
    else{
        next({type:FNode.FNodeResultType.Next});
    }
}

SlotScene.prototype.onRoundStart = function(next){
    console.log("onRoundStart");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onRoundEnd = function(next){
    console.log("onRoundEnd");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onRoundStartInFreeSpin = function(next){
    console.log("onRoundStartInFreeSpin");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onRoundEndInFreeSpin = function(next){
    console.log("onRoundEndInFreeSpin");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}
SlotScene.prototype.onSubRoundStart = function(next){
    console.log("onSubRoundStart");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onSubRoundEnd = function(next){
    console.log("onSubRoundEnd");
    setTimeout(function(){
        // next({type:FNode.FNodeResultType.Next});
        next();//default
    },1000);

}

SlotScene.prototype.onSpinStart = function(next){
    console.log("onSpinStart");
    setTimeout(function(){
        // next({type:FNode.FNodeResultType.Next});
        next(FNode.FNodeResultType.Next);//simple
    },1000);

}

SlotScene.prototype.onSpinEnd = function(next){
    console.log("onSpinEnd");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onSubRoundStartInFreeSpin = function(next) {
    console.log("onSubRoundStartInFreeSpin");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);

}

SlotScene.prototype.onSubRoundEndInFreeSpin = function(next) {
    console.log("onSubRoundEndInFreeSpin");
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    },1000);
}


/////////////////////
SlotScene.prototype.checkAndShowBigWin = function(next) {
    console.log("checkAndShowBigWin");
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

SlotScene.prototype.checkAndShowJackpot = function(next) {
    console.log("checkAndShowJackpot");
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

SlotScene.prototype.checkAndShowAllWinLine = function(next) {
    console.log("checkAndShowAllWinLine");
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

SlotScene.prototype.showEachWinLine = function(next) {
    console.log("showEachWinLine");
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

SlotScene.prototype.waitSpinButton = function(next) {
    console.log("waitSpinButton");
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