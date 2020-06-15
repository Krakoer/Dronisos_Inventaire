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

