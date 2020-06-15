// ----------------------------------------------------------- GESTION DE L'EXPORT DES ACTIFS EN CSV ET XLS --------------------------------------------------------------

//Return the visible Ids for the export
function getVisibleIds() {
    var th = $("th:visible");
    var tr = $("tr:visible").slice(1);

    //Get col number of N° Série:
    var indexSerial = 0;
    var head;
    while (head = th[indexSerial].textContent != "N° Série") {
        indexSerial++;
    }

    var ids = [];
    for (var row of tr) {
        ids.push(row.children[indexSerial].textContent);
    }
    return ids;
}

// Export to CSV the visible 
function exportCSV() {
    showAnimate(loadingScreen); // Show the loading screen
    var ids = getVisibleIds();
    var type = $(".nav-link.active").attr("id").indexOf("drone"); // type >= 0 if donre and < 0 if equipement

    //Post the Ids and type to export.php
    $.ajax({
        url: "export.php",
        type: 'post',
        data: { ids: ids, type: type },
        dataType: 'json',
        success: function (answer) {
            //console.log(answer);
            createCSV("exportBis.csv", answer); // Then export the received data
        },
        error: function (result, status, error) {
            hideAnimate(loadingScreen);
            console.log("result : " + result + " status : " + status + " err : " + error);
        }
    })
}

// Create a csv file given the rows 
// see https://stackoverflow.com/a/24922761 for more infos
function createCSV(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            result = result.replace(/é|è/g, 'e');
            result = result.replace(/°/g, 'um');
            result = result.replace(/€/g, 'euros');
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=ANSI;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    hideAnimate(loadingScreen);
}

// Parse export.php to get data to export
function exportXLS() {
    showAnimate(loadingScreen);
    var ids = getVisibleIds();
    var type = $(".nav-link.active").attr("id").indexOf("drone");

    $.ajax({
        url: "export.php",
        type: 'post',
        data: { ids: ids, type: type },
        dataType: 'json',
        success: function (answer) {
            //console.log(answer);
            createXLS(answer);
        },
        error: function (result, status, error) {
            hideAnimate(loadingScreen);
            console.log("result : " + result + " status : " + status + " err : " + error);
        }
    })
}


//Export rows to XLS 
// See the previous createCSV function and https://en.wikipedia.org/wiki/Microsoft_Office_XML_formats#Excel_XML_Spreadsheet_example for more infos
function createXLS(rows) {
     var xlsFile = '<?xml version="1.0" encoding="UTF-8"?> <?mso-application progid="Excel.Sheet"?> <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="https://www.w3.org/TR/html401/"> <Worksheet ss:Name="CognaLearn+Intedashboard"> <Table> <Column ss:Index="1" ss:AutoFitWidth="1" ss:Width="110"/>';
    var processRow = function (row) {
        var finalVal = '<Row>';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            result = result.replace(/é|è/g, 'e');
            result = result.replace(/°/g, 'um');
            result = result.replace(/€/g, 'euros');
         
            finalVal += '<Cell><Data ss:Type=';
            if(isNaN(result)){
                finalVal+='"String">';
            }
            else{
                finalVal+='"Number">';
            }
            finalVal += result;
            finalVal += '</Data></Cell>';
        }
        return finalVal + '</Row>';
    }

    for (var i = 0; i < rows.length; i++) {
        xlsFile += processRow(rows[i]);
    }
    xlsFile+='</Table></Worksheet></Workbook>';
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(xlsFile));
    hideAnimate(loadingScreen);

}