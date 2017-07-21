/**
 * Created by cuihandong on 19/06/2017.
 */

////////////////////////////////////////////////////
var FNodeResultType = {
    Next:"next",//default
    Continue:"continue",
    Break:"break"
};

var FNodeType = {
    Action:"action",
    Sequence:"sequence",
    Switch:"switch",
    While:"while"
};

////////////////////////////////////////////////////
var isNodeResultType = function(value){
    for(var k in FNodeResultType){
        if(value == FNodeResultType[k]){
            return true;
        }
    }
    return false;
}

var next = function(callback,res){
    if(callback){
        var resNormal = res;
        if(res==null){
            resNormal = {type:FNodeResultType.Next};
        }
        if(isNodeResultType(res)){
            resNormal = {type:res};
        }
        if(typeof res == "object" && res.type==null){
            res.type = FNodeResultType.Next;
            resNormal = res;
        }
        callback(resNormal)
    }
}

////////////////////////////////////////////////////
var FNodeAction = function(target){
    this.target = target;
    this.bStop = false;
};

FNodeAction.prototype.create = function(f){
    this.f = f;
};

FNodeAction.prototype.run = function(callback){
    var self = this;
    this.bStop = false;
    if(this.f){
        if(this.target){
            this.f.call(this.target,function(res){
                if(self.bStop){
                    return;
                }
                next(callback,res)
            });

        }
        else{
            this.f(function(res){
                if(self.bStop){
                    return;
                }
                next(callback,res)
            });
        }
    }
};

FNodeAction.prototype.stop = function(){
    this.bStop = true;
    if(this.f.clear_handler){
        this.f.clear_handler();
    }
};
////////////////////////////////////////////////////

var FNodeSequence = function(){
    this.callback = null;
    this.children = [];
    this.bStop = false;
};

FNodeSequence.prototype.create = function(children) {
    this.children = children;
};

FNodeSequence.prototype.run = function(callback) {
    this.bStop = false;
    if(this.children){
        this.callback = callback;
        this.runChild(0);
    }
};

FNodeSequence.prototype.stop = function(){
    this.bStop = true;
    for(var i = 0;i<this.children.length;++i){
        this.children[i].stop();
    }
};

FNodeSequence.prototype.runChild = function(index) {
    if(this.bStop){
        return;
    }
    if(this.children && this.children.length > index){
        var child = this.children[index];
        var self = this;
        child.run(function(res){
            if(self.bStop){
                return;
            }
            if(res) {
                switch (res.type) {
                    case FNodeResultType.Next : {
                        self.runChild(index + 1);
                        break;
                    }
                    case FNodeResultType.Break : {
                        self.run(self.callback);
                        break;
                    }
                }
            }
        });
    }
    else{
        if(this.callback){
            next(this.callback,FNodeResultType.Next);
            this.callback = null;
        }
    }
};

////////////////////////////////////////////////////
var FNodeWhile = function(){
    this.callback = null;
    this.children = [];
    this.bStop = false;
};

FNodeWhile.prototype.create = function(children) {
    this.children = children;
};

FNodeWhile.prototype.run = function(callback) {
    this.bStop = false;
    if(this.children){
        this.callback = callback;
        this.runChild(0);
    }
};

FNodeWhile.prototype.runChild = function(index){
    if(this.bStop){
        return;
    }
    if(this.children && this.children.length > index){
        var child = this.children[index];
        var self = this;
        child.run(function(res){
            if(self.bStop){
                return;
            }
            if(res) {
                switch (res.type) {
                    case FNodeResultType.Next : {
                        self.runChild(index + 1);
                        break;
                    }
                    case FNodeResultType.Continue : {
                        self.run(self.callback);
                        break;
                    }
                    case FNodeResultType.Break : {
                        if(self.callback){
                            next(self.callback,FNodeResultType.Next);
                            self.callback = null;
                        }
                        break;
                    }
                }
            }
        });
    }
    else{
        this.run(this.callback);
    }
};

FNodeWhile.prototype.stop = function(){
    this.bStop = true;
    for(var i = 0;i<this.children.length;++i){
        this.children[i].stop();
    }
};

////////////////////////////////////////////////////
var FNodeSwitch = function(){
    this.valueNode = null;
    this.caseNodeMap = null;
    this.bStop = false;
};

FNodeSwitch.prototype.create = function(valueNode,caseNodeMap){
    this.valueNode = valueNode;
    this.caseNodeMap = caseNodeMap;
};

FNodeSwitch.prototype.run = function(callback){
    this.bStop = false;
    if(this.valueNode && this.caseNodeMap){
        var self = this;
        var defaultNode = self.caseNodeMap["default"];
        this.valueNode.run(function(res){
            if(self.bStop){
                return;
            }
            var node = self.caseNodeMap[res.value];
            if(node==null){
                node = defaultNode;
            }
            if(node){
                node.run(function(res){
                    if(self.bStop){
                        return;
                    }
                    next(callback,FNodeResultType.Next);
                })
            }
            else{
                next(callback,FNodeResultType.Next);
            }
        })
    }
};

FNodeSwitch.prototype.stop = function(){
    this.bStop = true;
    this.valueNode.stop();
    for(var key in this.caseNodeMap){
        this.caseNodeMap[key].stop();
    }
};

////////////////////////////////////////////////////
var getNodeType = function(tree){
    if(tree == null){
        return null;
    }
    if(Array.isArray(tree)){
        if(tree.length > 0 && tree[0]=="loop"){
            return FNodeType.While;
        }
        else{
            return FNodeType.Sequence;
        }
    }
    var t = typeof tree;
    if(t === "object"){
        return FNodeType.Switch;
    }
    if(t === "function"){
        return FNodeType.Action;
    }
    return null;
};

var buildSwitch = function(tree,target){
    var switchNode = new FNodeSwitch(target);
    var valueNode = buildAction(tree.switch,target);
    var m = {};
    for(var key in tree){
        if(key=="switch"){
            continue;
        }
        if(key.search("case_")==0){
            var c = key.substring(5);
            var subtree = tree[key];
            m[c] = build(subtree,target);
        }
    }
    switchNode.create(valueNode,m);
    return switchNode;
};

var buildSequence = function(tree,target){
    if(tree && tree.length>0){
        var children = [];
        for(var i = 0;i<tree.length;++i){
            var node = build(tree[i],target);
            if(node){
                children.push(node);
            }
        }
        var sequenceNode = new FNodeSequence(target);
        sequenceNode.create(children);
        return sequenceNode;
    }
    return null;
};

var buildWhile = function(tree,target){
    if(tree && tree.length>0){
        var children = [];
        //第一个元素是"loop",所以直接从第二个元素开始
        for(var i = 1;i<tree.length;++i){
            var node = build(tree[i],target);
            if(node){
                children.push(node);
            }
        }
        var whileNode = new FNodeWhile(target);
        whileNode.create(children);
        return whileNode;
    }
    return null;
};

var buildAction = function(node,target){
    var actionNode = new FNodeAction(target);
    actionNode.create(node);
    return actionNode;
};

var build = function(tree,target){
    var t = getNodeType(tree);
    switch(t){
        case FNodeType.While: return buildWhile(tree,target);
        case FNodeType.Sequence: return buildSequence(tree,target);
        case FNodeType.Switch: return buildSwitch(tree,target);
        case FNodeType.Action: return buildAction(tree,target);
        default:
            console.log("can not find builder, type:",t);
    }
    return null;
};

var run = function(tree,target,callback){
    var node = build(tree,target);
    node.run(callback)
    return node;
};

var exports = module.exports;
exports.FNodeResultType = FNodeResultType;
exports.FNodeAction = FNodeAction;
exports.FNodeSequence = FNodeSequence;
exports.FNodeWhile = FNodeWhile;
exports.FNodeSwitch = FNodeSwitch;
exports.build = build;
exports.run = run;
