
目标:
js中常常有各种毁掉函数，有时候这些回掉函数构成一个复杂的系统，难以阅读和维护。
为了解决这个问题，flow通过构建一棵树（类似行为树），让整体的流程一目了然。

//...
//作为节点的函数的写法
var fun1 = function(next){
    setTimeout(function(){
        next({type:FNode.FNodeResultType.Next});
    ,1000}
}

//顺序
sequence:
[
    fun1,
    fun2,
    fun3,
    tree1,
    tree2,
    tree3,
]

//循环,子节点返回FNode.FNodeResultType.Break退出
//next({type:FNode.FNodeResultType.Break});

while:
[
    "loop",
    fun1,
    fun2,
    fun3,
    tree1,
    tree2
]

//switch case节点
//fun0计算switch的值，通过next设置。next({type:FNode.FNodeResultType.Next,value:"value1"})
switch:
{
    switch: fun0,
    case_value1:tree1,
    case_value2:fun2,
}

//一棵树的列子
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

//...

var slotScene = new SlotScene();
slotScene.build()   //建立树
slotScene.runNode.run();  //执行数
