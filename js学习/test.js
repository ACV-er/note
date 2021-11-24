/* top:
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            if (i === 1) continue top;
            console.log('i=' + i + ', j=' + j);
        }
        console.log(i);
    } */
/* test: {
	console.log(1);
	break test;
	console.log(2);
}
console.log(3);*/
var f = function () {
  console.log('1');
}

function f() {
  console.log('2');
}

f()