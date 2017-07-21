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

### 作为节点的函数可以带一个清理函数(clear_handler),在节点stop时会调用
```js
var fun1 = function(next){
    var id = setTimeout(function(){
        id = null;
        next();
        // or
        //next(FNode.FNodeResultType.Next);
    ,1000}
    arguments.callee.clear_handler = function(){
        if(id!=null)
            clearInterval(id)
        id = null;
    }
}
```

### 顺序节点
```js
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
{
    "switch": fun0,
    "case_value1":tree1,
    "case_value2":fun2,
}
```

### 一棵树
```js
NPC.prototype.build = function() {
    var tree = [
        "loop",
        this.idle,
        {
            "switch": this.waitOrder,//sit stand
            "case_sit": [
                this.gotoSeat,
                this.sitDown,
                [
                    "loop",
                    this.lookLeft,
                    this.idle,
                    this.lookRight,
                    this.idle,
                    this.checkTired,
                ],
            ],
            "case_stand": [
                this.standUp,
                this.idle,
                this.keke,
            ],
        },
    ];
    this.runNode = FNode.build(tree,this);
}

//...

var npc = new NPC();
npc.build()   //建立树
npc.runNode.run();  //执行树
