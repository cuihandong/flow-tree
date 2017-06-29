# flow-tree


> js中常常有各种回调函数，有时候这些回掉函数构成一个复杂的系统，难以阅读和维护。
> 为了解决这个问题，flow把这些回调函数通过一棵树的形式组织起来，让整体的流程一目了然。

## 安装

```js
npm install flow-tree
```

## 支持的特性

- 顺序节点
- 循环节点
- 选择节点

## 用法

### 作为节点的函数的写法
```js
var fun1 = function(next){
    setTimeout(function(){
        next();
        // or
        //next(FNode.FNodeResultType.Next);
    ,1000}
}
```

### 顺序节点
```js
sequence:
[
    fun1,
    fun2,
    fun3,
    tree1,
    tree2,
    tree3,
]
```

### 循环节点
> 子节点返回FNode.FNodeResultType.Break退出,
> next(FNode.FNodeResultType.Break);

```js
while:
[
    "loop",
    fun1,
    fun2,
    fun3,
    tree1,
    tree2
]
```

### switch case节点
> fun0计算switch的值，通过next设置。next({type:FNode.FNodeResultType.Next,value:"value1"})

```js
switch:
{
    switch: fun0,
    case_value1:tree1,
    case_value2:fun2,
}
```

### 一棵树
```js
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
```
