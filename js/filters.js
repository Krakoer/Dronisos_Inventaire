// ----------------------------------------------------------------------- GESTION DES FILTRES-------------------------------------------------------------------------------------------

document.addEventListener("mousedown", countEntries);
document.addEventListener("keyup", countEntries);

var nbFilter = 0; // Global var qui contient le nombre de filtres
var filters = {}; // Global var qui contient les filtres sous la forme numérodelacolonne => "terme de recherche"

//Ajoute un Filtre dans form-cont
// Inpout name optionnel : c'est pour les boutons Filtre maintenance et Filtre Stock
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