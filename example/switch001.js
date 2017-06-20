/**
 * Created by cuihandong on 20/06/2017.
 */
var FNode = require("../src/FNode");

var Walker = function(){

}

Walker.prototype.wantTo = function(next){
    console.log("想想去哪里")
    setTimeout(function(){
        var value = "";
        var r = Math.random();
        if(r>0.7){
            value = "shop";
            console.log("我想去商店")
        }
        else if(r>0.3){
            value = "school"
            console.log("我想去学校")
        }
        else{
            console.log("我不知道去哪")
        }
        next({type:FNode.FNodeResultType.Next,value:value})
    },1000)

}

Walker.prototype.gotoShop = function(next){
    console.log("走去商店")
    setTimeout(function(){
        console.log("到达商店")
        next({type:FNode.FNodeResultType.Next})
    },1000)
}

Walker.prototype.gotoSchool = function(next){
    console.log("走去学校")
    setTimeout(function(){
        console.log("到达学校")
        next({type:FNode.FNodeResultType.Next})
    },1000)
}

Walker.prototype.stayAtHere = function(next){
    console.log("留在这里")
    setTimeout(function(){
        console.log("留在这里结束")
        next({type:FNode.FNodeResultType.Next})
    },1000)
}

var build = function(){
    var walker = new Walker();
    var tree = {
        switch:walker.wantTo,
        case_shop:walker.gotoShop,
        case_school:walker.gotoSchool,
        case_default:walker.stayAtHere
    }
    var fnode = FNode.build(tree,walker);
    return fnode;
}

var main = function(){
    build().run(function(){
        console.log("树执行结束");
    });
}

main();