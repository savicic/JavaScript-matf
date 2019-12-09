var matrix;

var buttonGenerated = Array(4).fill(false);

var skeleton;

var numOfFields = 4;

var colors = ["crvena.jpg", "zuta.jpg", "black.png"];

var solution = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]

var playerToNum = {

    "kristina.jpg" : 0,

    "yulia.jpg" : 1,

    "dasha.jpg" : 2,

    "liza.jpg" : 3
};

var resultShown = Array(numOfFields).fill(false);

var gameStart = false;

var gameIsOver = false;





function drawTable() {



    var table = document.createElement("div");

    table.setAttribute("class", "div-table");

    for (i = 0; i < numOfFields; i++) {

        var row = document.createElement("div");

        row.setAttribute("class", "div-table-row");

        row.setAttribute("id", "row" + i);

        var row_content = "";



        for (j = 0; j < 4; j++)  {

            row_content = row_content + ("<div id = x" + String(i*4 + j)  + " class = div-table-col>" + "</div>");

        }

        row.innerHTML = row_content;

        table.appendChild(row);

    }

    document.body.appendChild(table);

}



function drawResult(index = -1) {



    skeleton = document.createElement("div");

    skeleton.setAttribute("id", "res");

    document.body.appendChild(skeleton);

}



function findFirstFalse(matrix) {

    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix[i].length; j++) {

            if (!matrix[i][j])

                return [i, j];

        }

    }



    return [-1, -1];

}





function previousRowConfirmed(row_indicator, confirmedRows) {

    

    if (row_indicator == 0)

        return true;

    else

        return confirmedRows[row_indicator-1];

}









function solveRedYellow(tmp_result) {

    var red_fields = 0;

    var yellow_fields = 0;

    for (let i = 0; i < 4; i++) {

        red_fields = tmp_result[i] === solution[i] ? red_fields+1 : red_fields;

    }



    solution_bucket = Array(numOfFields).fill(0);

    result_bucket = Array(numOfFields).fill(0);

    for (let i = 0; i < 4; i++) {

        solution_bucket[solution[i]]++;

        result_bucket[tmp_result[i]]++;

    }

    for (let i = 0; i < numOfFields; i++) {

        if (solution_bucket[i] > 0 && result_bucket[i] > 0)

            yellow_fields += Math.min(solution_bucket[i], result_bucket[i]);

    }



    return [red_fields, yellow_fields - red_fields];

}





function showResult(colors, index) {



    if (resultShown[index])

        return;

    row = document.createElement("div");

    row.setAttribute("class", "color-row");

    

    for (let i = 0; i < colors.length; i++) {

        var field = document.createElement("div");

        field.setAttribute("class", "color-field");

        row.appendChild(field);

        var image = document.createElement("img");

        image.setAttribute("src", colors[i].getAttribute("src"));

        image.setAttribute("class", "boje");

        field.appendChild(image);

    }

    skeleton.appendChild(row);

}



function generateColors(result, index) {

    var colPic = [];

    for (let i = 0; i < result[0]; i++) {

        var element = document.createElement("img");

        element.setAttribute("src", colors[0]);

        colPic.push(element)

    }



    for (let i = 0; i < result[1]; i++) {

        var element = document.createElement("img");

        element.setAttribute("src", colors[1]);

        colPic.push(element);

    }





    for (let i = 0; i < 4 - result[0] - result[1]; i++) {

        var element = document.createElement("img");

        element.setAttribute("src", colors[2]);

        colPic.push(element);

    }



    showResult(colPic, index);

    colPic.forEach((e) => {

        e.setAttribute("class", "boje");

    });



}



function checkResult(index) {

    var row = document.querySelector("#row" + index);

    var input = [];

    var divs = row.childNodes;

    for (const div of divs) {

        if (div.nodeName !== "BUTTON") {

            for (let pic of div.childNodes) {

                input.push(playerToNum[pic.getAttribute("src")]);

            }

        }

    }

    

    var result = solveRedYellow(input);

    generateColors(result, index);

    resultShown[index] = true;

    if (JSON.stringify(result) == JSON.stringify([4, 0])) {

        var time = document.getElementById("bar").getAttribute("style").match(/\d+/)[0];

        var solution = findFirstFalse(matrix);

        var result = (solution[0] - 1) / -5 * 50 + 60 + time / 2;

        window.alert("BRAVO!!! TVOJ REZULTAT JE: " + result);

        gameIsOver = true;

        sendResult(result);

    }

}



function confirmRow(confirmedRows, index) {

    if (!not_filled_row(index, matrix)) {

        id = parseInt(this.getAttribute("id"));

        confirmedRows[index] = true;



        checkResult(index);

    }    

}



function generateButton(index, confirmedRows) {

    if (buttonGenerated[index])

        return;

    var button = document.createElement("button");

    button.setAttribute("id", String(index));

    button.innerHTML = "POTVRDI";

    button.addEventListener("click", confirmRow.bind(button, confirmedRows, index));

    buttonGenerated[index] = true;

    document.getElementById("row" + index).appendChild(button);

}

function setUndo(matrix, confirmedRows) { 

    undoButton = document.createElement("button");

    undoButton.innerHTML = "UNDO";

    undoButton.setAttribute("id", "undoBtn");

    undoButton.addEventListener("click", function () {

        var empty = findFirstFalse(matrix);

        console.log(empty);

        if (empty[1] === 0 && empty[0] > 0 && confirmedRows[empty[0]-1])

            return;

        if (empty[0] === 0 && empty[1] === 0)

            return;



        if (empty[1] === 0) {

            empty[0]--;

            empty[1] = 3;

        } else if (JSON.stringify(empty) == JSON.stringify([-1, -1])) {

            empty = [5, 3];

        }

        else empty[1]--;

        var idToDelete = 4 * empty[0] + empty[1];

        matrix[empty[0]][empty[1]] = false;

        var fieldToDelete = document.getElementById("x" + idToDelete);

        fieldToDelete.removeChild(fieldToDelete.firstElementChild);

    });



    document.getElementById("slike").appendChild(undoButton);

}



function not_filled_row(i, matrix) {

    return matrix[i].some(elem => {return elem == false});

}



function initListener(matrix) {

    var confirmedRows = Array(numOfFields).fill(false);

    var finishedRows = Array(numOfFields).fill(false);

    var pics = document.getElementsByTagName("img");

    for (var index = 0; index < pics.length; index++)

           pics[index].addEventListener("click", function () {

               if (gameIsOver)

                   return;

               if (!gameStart)

                   return;

               var player = this.getAttribute("src");

               var emptyFields = findFirstFalse(matrix);

               if (previousRowConfirmed(emptyFields[0], confirmedRows)) {

                   matrix[emptyFields[0]][emptyFields[1]] = true;

                   if (emptyFields[1] == 3) {

                       finishedRows[emptyFields[0]] = true;

                       generateButton(emptyFields[0], confirmedRows);

                   }

                   var query = "#x" + String(emptyFields[0] * 4 + emptyFields[1]);

                   var image = document.createElement("img");

                   image.setAttribute("src", player);

                   document.querySelector(query).appendChild(image);

                }

           },

        false)





    setStart();    

    setUndo(matrix, confirmedRows);

}



function setStart() {

    var startButton = document.createElement("button");

    startButton.setAttribute("id", "startButton");

    startButton.innerHTML = "START";

    document.body.appendChild(startButton);

    startButton.onclick = function() {

        gameStart = true;

    }

}



function makeProgressBar() {

    var myProgress = document.createElement("div");

    var myBar = document.createElement("div");

    myProgress.setAttribute("id", "progress");

    myBar.setAttribute("id", "bar");

    document.body.appendChild(myProgress);

    myProgress.appendChild(myBar);

    

    (function(){

        var width = 0;

        var interval = setInterval(function() {

            if (width >= 100) {

                clearInterval(interval);

                gameIsOver = true; 

                window.alert("ZAO NAM JE, NISTE RESILI TACNO :(");         

            } else if (!gameIsOver && gameStart){

                myBar.style.width = width++ + "%";

            }

        }, 550)

    })();

}





function play() {

    matrix = Array(numOfFields);

    for (let i = 0; i < matrix.length; i++)

        matrix[i] = Array(4).fill(false);



    makeProgressBar();

    initListener(matrix);

}





// -------------------------------- ZA DRUGI DEO -------------------------------------

function sendResult(result) {

    //TODO

}











drawTable();

drawResult();

play();
