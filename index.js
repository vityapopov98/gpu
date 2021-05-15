const { GPU } = require('gpu.js');
var now = require("performance-now")
const gpu = new GPU();

matrices = [[], []];
const size = 5000
generateMatrices(size)

const multiplyMatrix = gpu.createKernel(function(a, b, size) {
    let sum = 0;
    for (let i = 0; i < 512; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
}).setOutput([512, 512]);

var startTime = now();
const c = multiplyMatrix(matrices[0], matrices[1], size);
var endTime = now();
console.log('gpu time', (endTime - startTime) + "ms")


const cpuMultyplyMatrix = function(a, b, size){    
    
    let productRow = Array.apply(null, new Array(size)).map(Number.prototype.valueOf, 0);
    let product = new Array(size);
    for (let p = 0; p < size; p++) {
        product[p] = productRow.slice();
      }
  
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          for (let k = 0; k < size; k++) {
            product[i][j] += a[i][k] * b[k][j];
          }
        }
      }
    
}

    startTime = now();
    cpuMultyplyMatrix(matrices[0], matrices[1], size)
    endTime = now();
    console.log('cpu time', (endTime - startTime) + "ms")


function generateMatrices(size) {
    for (let y = 0; y < size; y++) {
     matrices[0].push([])
     matrices[1].push([])
     for (let x = 0; x < size; x++) {
      const value1 = parseInt((Math.random() * 10).toString())
      const value2 = parseInt((Math.random() * 10).toString())
      matrices[0][y].push(value1)
      matrices[1][y].push(value2)
     }
    }
}