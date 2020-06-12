document.addEventListener("mousedown", countEntries);
document.addEventListener("keyup", countEntries);

// ----------------------------------------------------------- GESTION GENERALE DE LA PAGE -------------------------------------------------------------------------

//Empêher la soumission d'un formulaire en appuyant sur entrée (ça pose des poblèmes à cause des douchettes qui renvoient un retour à la ligne après le scan)
$(document).ready(function () {
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

//Pour montrer la page de chargement avec transition d'oppacité
function showAnimate(object) {
    if (object.classList.contains("hide")) {
        object.classList.remove("hide");
        setTimeout(function () {
            object.classList.remove("visuallyHidden");
        }, 10);
    }
}

//Idem mais pour la cacher
function hideAnimate(object) {
    object.classList.add('visuallyHidden');
    object.addEventListener('transitionend', function (e) {
        object.classList.add("hide");
    }, {
        capture: false,
        once: true,
        passive: false,
    });
}

//Affichier et cacher le loading spinner qui prend toute la page
var loadingScreen;
$(document).ready(function () {
    loadingScreen = document.getElementById('loading-full-size');
    hideAnimate(loadingScreen);
});

function loadpage() {
    // Relie l'event onshow du modal addOps pour les boutons passer en maintenance et remettre en stock
    $('#addOperationModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var operation = button.data('ops')

        var modal = $(this)
        if (operation != undefined) {
            switch (operation) {
                case 'STOCK':
                    modal.find('.modal-title').text('Remettre au stock')
                    break;
                case 'MAINTENANCE':
                    modal.find('.modal-title').text('Passer en maintenance')
                    break;
            }
            modal.find('#operationName').val(operation)
            modal.find('#operationName').prop("disabled", true);
        }
        else {
            modal.find('.modal-title').text('Affecter à une Opération')
            modal.find('#operationName').val("");
            modal.find('#operationName').prop("disabled", false);
        }
    })

    // relie l'event onshow du modal editEntry à la création du formulaire d'édition via fetch-edit.php
    $('#editEntryModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id') // Id pass through button
        var type = button.data("type");
        var form = $("#editEntryForm");
        $("#editLoadingSpinner").show(); // Show loading spinner
        // Create the form using fetch-edit.php
        $.ajax({
            type: 'get',
            url: 'fetch-edit.php',
            data: 'id=' + id + '&type=' + type,
            dataType: 'html',
            success: function (html) {
                $("#editLoadingSpinner").hide(); // Hide the loading spinner
                $(html).appendTo(form); // Append the form to the modal
                $(".autocomplete-edit").each(function () { // Add the autocomplete JQuery UI for the fields with class autocomplete-edit
                    var id = $(this).attr('id')
                    console.log(id);
                    $(this).autocomplete({
                        source: function (request, response) {
                            $.ajax({
                                url: "autocomplete.php",
                                type: 'post',
                                dataType: "json",
                                data: {
                                    term: request.term, id: id
                                },
                                success: function (data) {
                                    response(data);
                                }
                            });
                        },
                    });
                });
            }
        })
    })

    // Vider le modal d'édition d'entrée quand il est fermé
    $('#editEntryModal').on('hidden.bs.modal', function (event) {
        var form = $("#editEntryForm")[0];
        while (form.hasChildNodes()) {
            form.removeChild(form.lastChild);
        }
    })

    //Auto completion de JQuery UI (cf https://jqueryui.com/autocomplete/)
    $(".autocomplete").each(function () {
        var id = $(this).attr('id')
        
        $(this).autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "autocomplete.php",
                    type: 'post',
                    dataType: "json",
                    data: {
                        term: request.term, id: id
                    },
                    success: function (data) {
                        response(data);
                    }
                });
            },
        });
    });

    setup_printer();
}

// ----------------------------------------------------------------------- GESTION DES FILTRES-------------------------------------------------------------------------------------------


var nbFilter = 0; // Global var qui contient le nombre de filtres
var filters = {}; // Global var qui contient les filtres sous la forme numérodelacolonne => "terme de recherche"

//Ajoute un Filtre dans form-cont
// Inout name optionnel : c'est pour les boutons Filtre maintenance et Filtre Stock
function addField(name) {
    var container = document.getElementById("form-cont");
    nbFilter += 1;

    var filter = "N° Série"
    var value = "";

    // Si on a l'argument optionnel
    if (arguments.length > 0) {
        filter = "Opération"
        value = name;
    }

    // Create the label for the filter
    var label = document.createElement("label");
    label.innerHTML = "Filter N° " + (nbFilter).toString();
    var att = document.createAttribute("for");
    att.value = "filter-" + nbFilter + "-title";
    label.setAttributeNode(att);
    container.appendChild(label);

    // Fetch All Columns
    th = $("th:visible");

    // Create the selector for the filter

    var select = document.createElement("select");
    select.id = "filter-" + nbFilter + "-title";
    select.className = "form-control";
    var att = document.createAttribute("onchange");
    att.value = "updateFilters();";
    select.setAttributeNode(att);
    container.appendChild(select);
    for (i = 1; i < th.length; i++) {
        var input = document.createElement("option");
        input.value = th[i].innerHTML;
        input.innerHTML = th[i].innerHTML;
        if (th[i].innerHTML == filter) {
            input.setAttributeNode(document.createAttribute("selected"));
        }
        select.appendChild(input);
    }

    // Create the input field for the value fo the filter

    input = document.createElement("input");
    input.id = "filter-" + nbFilter + "-value";
    input.value = value;
    input.type = "text";
    input.className = "form-control";
    att = document.createAttribute("onkeyup");
    att.value = "updateFilters();";
    input.setAttributeNode(att);
    container.appendChild(input);
    
    container.appendChild(document.createElement("br"));
}

// Reset the filters
function clearFilters() {
    var container = document.getElementById("form-cont");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    while ($(".hidden").length > 0) {
        $(".hidden")[0].style.display = "";
        var att = document.createAttribute("class");
        att.value = "";
        $(".hidden")[0].setAttributeNode(att);
    }

    nbFilter = 0;
    filters = {};
    countEntries();
}

// Trigger with onChange on every filter
// Loop through all filters and create the filters global variable
function updateFilters() {
    var inputs, inputsNames = [], inputsValues = [];
    var colNb;
    inputs = document.getElementById("form-cont").children;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id.indexOf("value") > -1) {
            inputsValues.push(inputs[i].value.toUpperCase());
        }
        if (inputs[i].id.indexOf("title") > -1) {
            inputsNames.push(inputs[i].value);
        }
    }
    var head = $("th:visible");
    var heads = [];
    for (var i = 0; i < head.length; i++) {
        heads.push(head[i].textContent);
    }
    filters = {};
    for (i = 0; i < inputsValues.length; i++) {
        colNb = heads.indexOf(inputsNames[i]);
        filters[colNb] = inputsValues[i];
    }
    doSearch();
}

// Proceed the search given the filters 
function doSearch() {
    var td, tr, i, found;
    tr = $("tr:visible,.hidden"); // tr:visible give the visible rows (if not set it also return the rows of the hidden table) and .hidden to also loop throught hidden rows

    //Loop through rows
    for (i = 1; i < tr.length; i++) { // For each row ...
        td = tr[i].getElementsByTagName("td"); // ...You get the cells...
        found = true;
        for (var filter in filters) { // ... And for each filter ...
            if (td[filter].textContent.toUpperCase().indexOf(filters[filter]) <= -1) { // ... You check if you find the value 
                found = false; 
            }
        }
        if (found) { // If you find it
            tr[i].style.display = ""; // You display it (remove the css display : none)
            var att = document.createAttribute("class");
            att.value = ""; // And reset the hidden class
            tr[i].setAttributeNode(att);
            found = false;
        } else {
            tr[i].style.display = "none"; // Hide the elemnt
            var att = document.createAttribute("class");
            att.value = "hidden"; // Add the hide class so you can select it for the next doSearch using jquery
            tr[i].setAttributeNode(att);
        }
    }
    countEntries(); // Update the entries count
}

// COunt the entries unfiltered
function countEntries() {
    var par = document.getElementById("entryNb");
    par.textContent = ($("tr:visible").length - 1).toString() + " actif(s)";
}


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



// --------------------------------------------------------------- GESTION DE LA BDD ET DES FORMULAIRES ---------------------------------------------------------------------------------

//Trigger par la vaildation du formulaire d'édition via validateForm()
function sendEditData(inputs, type, id) {
    var donne = {};
    var data = { entry: type, id: id };

    for (var input of inputs) {
        if (input.type != "hidden") {
            var field = input.name;
            var val = input.value;
            donne[field] = val;
        }
    }
    data["data"] = donne;

    sendDT(data, "edit-entry.php");
}

//Trigger par la soumission du formulaire d'ajout d'un actif via validateForm()
//Inputs : tableau d'inputs (html) et type d'entrée (drone ou équipement)
function addEntryButton(inputs, entryType) {
    var values = {};
    var data = { entry: entryType };

    for (var input of inputs) {
        var field = input.name;
        var val = input.value;
        values[field] = val;
    }
    data['data'] = values;
    //Requête du scipt add-entry.php avec Ajax
    sendDT(data, "add-entry.php");
}

//Trigger par la soumission du formulaire d'ajout d'une opération via validateForm()
function addOpsButton() {
    var ops = document.getElementById("operationName").value; // Nom de l'opération à ajouter
    var ul = document.getElementById("actList"); // List des id des actifs à ajouter à l'opération
    var children = ul.children;
    var data = { operation: ops, serials: [] };
    var serial;

    for (var i = 0; i < children.length; i++) {
        serial = children[i].id.split("-")[1];
        data["serials"].push(serial);
    }

    sendDT(data, "add-ops.php");
}

//Trigger par le boutton Supprimer les actifs du modal Del Entries
function delEntries() {
    var ul = document.getElementById("delList");
    var children = ul.children;
    var data = { serials: [] };
    var serial;

    for (var i = 0; i < children.length; i++) {
        serial = children[i].id.split("-")[1];
        data["serials"].push(serial);
    }

    sendDT(data, "del-entries.php");
}

//Requête ajax
//Inputs : data sous form d'un Objet {} et url string
function sendDT(data, url) {
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'text',
        success: function (answer) {
            alert(answer);
            window.location.reload();
        },
        error: function (result, status, error) {
            alert("result : " + result + " status : " + status + " err : " + error);
        }
    })
}

// Surligne ou dé-surligne un champ donné
function surligne(champ, erreur) {
    if (erreur)
        champ.style.backgroundColor = "#fba";
    else
        champ.style.backgroundColor = "";
}


//Validation des formulaires : check les inputs requis et envoie les valeurs si c'est ok
//Prend un formulaire en entrée, et un type dans le cas de l'édition (passé via un champs caché dans le cas de l'édition)
//retourne un bool qui décrit si le formulaire est correcte
function validateForm(form, type) {
    var inputs = form.getElementsByTagName("input");
    var valide = true;
    var id;
    for (var input of inputs) {
        if (input.type == "text" && input.required && checkIfEmpty(input)) {
            valide = false;
        }
        if (input.type == "hidden") { // Champs cachés qui contiennent des infos pour l'éditions d'actifs (type et ID) 
            if (input.name == "id") {
                id = input.value;
            }
            else if (input.name == "type") {
                type = input.value;
            }
        }
    }
    if (valide) {
        if (id != undefined) { // Si on a trouvé un ID c'est qu'on édite
            sendEditData(inputs, type, id);
        }
        else { // Sinon on ajoute un actif
            addEntryButton(inputs, type);
        }
    }
    return valide;
}

function checkIfEmpty(champ) {
    if (champ.value == "") {
        surligne(champ, true);
        return true;
    }
    else {
        surligne(champ, false);
        return false;
    }
}

// Change la visibilité des formulaire de création d'entrée selon le type
function selectForm() {
    var formType = $("#entryType")[0].value;
    if (formType == "drone") {
        $("#droneForm").removeClass("hide");
        $("#equipementForm").addClass("hide");
    }
    else {
        $("#droneForm").addClass("hide");
        $("#equipementForm").removeClass("hide");
    }
}

// --------------------------------------- GESTION DE L'AJOUT DE NUMERO DE SERIE DANS LES MODALS DE SUPPRESSION ET D'AFFECTATION ---------------------------------------------

// Ajoute un <li> dans la liste des numéro de série avec le numéro de série rentré dans le input (pour Ops)
function addEntryOpsList() {
    var ul = document.getElementById("actList");
    var serialInput = document.getElementById("serialInput");
    var serialNb = serialInput.value;
    serialInput.value = "";
    var li = buildEntryItem(serialNb, 'ops');
    ul.appendChild(li);
}

// Ajoute un <li> dans la liste des numéro de série avec le numéro de série rentré dans le input (pour Del)
function addEntryDelList() {
    var ul = document.getElementById("delList");
    var serialInput = document.getElementById("serialInput2");
    var serialNb = serialInput.value;
    serialInput.value = "";
    var li = buildEntryItem(serialNb, 'del');
    ul.appendChild(li);
}

function clearEntryList() {
    var ul = document.getElementById("actList");
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.lastChild);
    }
}

//Créé un élément <li> avec un numéro de série et un boutton pour le supprimer
function buildEntryItem(serialNb, source) {
    var li = document.createElement("li");
    li.innerHTML = serialNb;
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.id = "entryItem-" + serialNb + "-" + source;

    var but = document.createElement("button");
    but.innerHTML = "delete Item";
    but.className = "btn btn-danger";
    but.onclick = function () {
        document.getElementById("entryItem-" + serialNb + "-" + source).remove();
    };
    li.appendChild(but);

    return li
}

// Pour que la douchette ajoute l'actif automatiquement avec un retour à la ligne
function onKeyDownInput(source) {
    if (event.keyCode == 13) {
        if (source == 'ops')
            addEntryOpsList();
        else if (source == 'del')
            addEntryDelList();
    }
}

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