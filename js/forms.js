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