//-------------------------------------- GESTION DE L'IMPRESSION DES ETIQUETTES ----------------------------------------------------------------------------------------------

// See https://www.zebra.com/us/en/support-downloads/printer-software/by-request-software.html and general zebra doc for more info

var selected_device;

function setup_printer() {
    //Get the default device from the application as a last step. Discovery takes longer to complete.
    BrowserPrint.getDefaultDevice("printer", function (device) {
        //Save device
        selected_device = device;
    }, function (error) {
        alert("error : " + error);
    })
}

var errorCallback = function (errorMessage) {
    alert("Error: " + errorMessage);
}

// return the last ow of the visible <table>
function selectLastRow() {
    var heads = $("th:visible");
    var rows = $("tr:visible");
    var row = rows[rows.length - 1].children;
    var lastRow = [];
    for (var i = 1; i < heads.length; i++) {
        lastRow[heads[i].textContent] = row[i].textContent;
    }
    return lastRow;
}

// Print the last row
function printLabel() {
    var lastRow = selectLastRow();
    var labelType = document.getElementById("labelTypeSelector").value; // Select the type of label
    var labelString = "";
    switch (labelType) {// Build the label
        case "zephyr":
            labelString = buildLabel(labelType, lastRow["Modèle"], lastRow["N° Série"]); 
            break;
        case "helios":
            labelString = buildLabel(labelType, lastRow["N° Série"]);
            break;
        case "materiel":
            labelString = buildLabel(labelType, lastRow["Modèle"], lastRow["ID Dronisos"], lastRow["N° Série"])
            break;
        case 'bureatique':
            labelString = buildLabel(labelType, lastRow["Modèle"], lastRow["N° Série"]);
            break;
        default:
            break;
    }
    if (selected_device != undefined && selected_device != null)
        selected_device.send(labelString, undefined, errorCallback); // Print the label
    console.log(labelString);
    return labelString;
}

// For more info check ZPL documentation
// https://zpldesigner.com/
// https://en.wikipedia.org/wiki/Zebra_Programming_Language
function buildLabel(labelType) {
    var logo = "^GFA,357,357,7, 00000000000000 00000000000000 00000000000000 00000000000000 003FC001FE0000 00FFF007FF8000 03E07C0F03C000 07801E1C00E000 06000E38007000 0E000770003800 1C0003E0001800 180001C0001C00 180001C0000C00 180001C0000C00 380601C0600C00 380E01C0F00C00 180700C0B00C00 180180C1F00C00 1800C0C3800C00 1C0060E7001C00 0C00306E001800 0E00007C003000 07000338007000 03C0038001E000 01F981C0CFC000 007FC4E1FF0000 00FFCE707F8000 01E0073001E000 0380038000F000 07000180003800 0E001004001800 0C002006001C00 18004083000C00 180081C1800C00 180101C0C00E00 380701C0700600 380E01C0700600 180601C0300600 180001C0000E00 180001C0000C00 1C0003E0000C00 0C000360001C00 0E000770003800 07000E38007000 03801C1E00E000 01F0F80F87C000 007FE003FF8000 001F80007C0000 00000000000000 00000000000000 00000000000000";
    // String 1 + Modele + String 2 + Serial + String 3 + serial + String4
    var zephyrString = ['^XA^LS225^A0N,25,25^FO15, 15^FD', '^FS^A0N,17,20^FO15, 45^FD', '^FS^FO250, 40^BQN,2,5,Q,7^FDQA,', '^FS^FO180,120^'+logo+'^FS^A0N,20,20^FO15,140^FDDRONISOS^FS^A0N,14,17^FO15,160^FDcontact@dronisos.com^FS^XZ'];
    // String 1 + serial + String 2
    var heliosString = ['^XA^LS225^FO10, 0^BQN,2,5,Q,7^FDQA,', '^FS^XZ'];
    // String 1 + Model + String 2 + ID_Dronisos + String 3 + Serial + String 4 + Serial + String 5
    var materialString = ["^XA^LS225^A0N,25,25^FO15, 10^FD", "^FS^A0N,23,20^FO15, 40^FD", "^FS^A0N,17,20^FO15, 75^FD", "^FS^FO250, 40^BQN,2,5,Q,7^FDQA,", '^FS^FO180,120'+logo+'^FS^A0N,20,20^FO15,140^FDDRONISOS^FS^A0N,14,17^FO15,160^FDcontact@dronisos.com^FS^XZ']

    var labelString = "";
    switch (labelType) {
        case "zephyr":
            labelString = zephyrString[0];
            labelString += arguments[1];
            labelString += zephyrString[1];
            labelString += arguments[2];
            labelString += zephyrString[2];
            labelString += arguments[2];
            labelString += zephyrString[3];
            break;
        case "helios":
            labelString = heliosString[0];
            labelString += arguments[1];
            labelString += heliosString[1];
            break;
        case "materiel":
            labelString = materialString[0];
            labelString += arguments[1];
            labelString += materialString[1];
            labelString += arguments[2];
            labelString += materialString[2];
            labelString += arguments[3];
            labelString += materialString[3];
            labelString += arguments[3];
            labelString += materialString[4];
            break;
        case "bureautique":
            labelString = zephyrString[0];
            labelString += arguments[1];
            labelString += zephyrString[1];
            labelString += arguments[2];
            labelString += zephyrString[2];
            labelString += arguments[2];
            labelString += zephyrString[3];
            break;
        default:
            labelString = zephyrString[0];
            labelString += arguments[1];
            labelString += zephyrString[1];
            labelString += arguments[2];
            labelString += zephyrString[2];
            labelString += arguments[2];
            labelString += zephyrString[3];
            break;
    }

    return labelString;
}

// Change Image in the print label modal
function changeLabelTypeImg() {
    var labelType = document.getElementById("labelTypeSelector").value;
    var img = document.getElementById("labelTypeImg");
    switch (labelType) {
        case "zephyr":
            img.src = "/assets/img/drone_zephyr.png";
            break;
        case "helios":
            img.src = "/assets/img/drone_helios.png";
            break;
        case "materiel":
            img.src = "/assets/img/materiel.png";
            break;
        case "bureautique":
            img.src = "/assets/img/bureautique.png";
            break;
        default:
            img.src = "/assets/img/drone_zephyr.png";
            break;
    }
}