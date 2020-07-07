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