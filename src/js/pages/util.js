/* zero_padding: string */function zP(order, text){
    for(var i=0;i<order;i++){
        text = '0' + text;
    }
    return text.slice(order*(-1));
}
/* dict.stringify */function dump(dict,f){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    if(f) return s;
    alert(s);
}