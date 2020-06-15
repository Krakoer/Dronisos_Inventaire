<!--    Main File
        Creates the tabs, filters etc. using bootstraps components
        Uses Bootstrap 4 , jQuery 3.5.0, jquery UI, AwesomFont (for the edit icon) and Zerba Browser Print JS Library
 -->
<!DOCTYPE html>
<html>

<head>
    <title>Inventory Management</title>

    <link rel="stylesheet" href="/css/bootstrap.css">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/loading.scss">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/jquery-ui.min.css">
    <script src="/js/jquery-3.5.0.min.js"></script>
    <script src="/js/bootstrap.js"></script>
    <script src="/js/main.js"></script>
    <script src="/js/printer.js"></script>
    <script src="/js/filters.js"></script>
    <script src="/js/export.js"></script>
    <script src="/js/forms.js"></script>
    <script src="/js/modals.js"></script>
    <script type="text/javascript" src="js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/BrowserPrint-3.0.216.min.js"></script>

    <?php include("add-entry-form.php");
    include("fetch-actifs.php");
    include("affect-ops-elements.php");
    include("fetch-ops.php"); ?>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />

</head>

<body onload="countEntries(); loadpage();" class="sb-nav-fixed">

    <!--   ------------------------------------------------------------- Page de chargement --------------------------------------------------------- -->
    <div id="loading-full-size">
        <div class="container" id="centerLoading">
            <div class="dot-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dot-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dot-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>
    <!--   ------------------------------------------------------------------- NavBar --------------------------------------------------------- -->
    <nav class="navbar navbar-dark bg-dark mb-5">
        <div class="col-auto mr-auto">
            <img src="/assets/img/logo.webp" style="width:200px; height:48px;">

        </div>
        <div class="col-auto text-white"><span class="pull-right">
                <h1 style="margin-bottom:0px;">Inventaire</h2>
            </span></div>
    </nav>
    <!--   ------------------------------------------------------------- Contenu principal --------------------------------------------------------- -->
    <div class="container-fluid">
        <!------------------------------------------ Tabs Selectors ------------------------------ -->
        <div class="row">
            <div class="col-9">
                
                <div class="d-flex">

                    <ul class="w-100 nav nav-tabs custom_pills nav-pills" id="pills-tab" role="tablist">

                        <li class="nav-item">
                            <a class="nav-link active nav-link-color" id="drone-tab" data-toggle="tab" href="#drone" role="tab" aria-selected="true" aria-controls="drone" onclick="clearFilters();">Drones</a>
                        </li>


                        <li class="nav-item">
                            <a class="nav-link nav-link-color" id="equipement-tab" data-toggle="tab" href="#equipement" role="tab" aria-selected="false" aria-controls="equipement" onclick="clearFilters();">Equipement</a>
                        </li>


                        <li class="ml-auto navOp nav-item align-self-end">
                            <a class="nav-link nav-link-colorOp" id="operations-tab" data-toggle="tab" href="#operations" role="tab" aria-selected="false" aria-controls="operations" onclick="clearFilters();">Operations</a>
                        </li>


                    </ul>

                </div>
            </div>
        </div>

       <!--   ------------------------------------- Tabs and filters ----------------------------- -->
        <div class="row justify-content-around">
            <!-- TABS -->
            <div class="col-9">
                <div class="table-responsive tab-content mb-5">
                    <div class="tab-pane fade show active" id="drone" role="tabpanel" aria-labelledby="drone-tab"><?php createTab("drones"); ?></div>
                    <div class="tab-pane fade" id="equipement" role="tabpanel" aria-labelledby="equipement-tab"><?php createTab("equip"); ?></div>
                    <div class="tab-pane fade" id="operations" role="tabpanel" aria-labelledby="operations-tab"><?php createOpsTab(); ?></div>
                </div>

            </div>
            <!-- FILTERS -->
            <div class="col-3">
                <div class="container-fluid">
                    <div class="row">
                        <div class="btn-group">
                            <button type="button" class="p-2 btn btn-outline-secondary btn-control col-md-3" data-toggle="modal" data-target="#addEntryModal">Ajouter un actif</button>
                            <button type="button" class="p-2 btn btn-outline-secondary btn-control col-md-3" data-toggle="modal" data-target="#printModal">Imprimer l'étiquette</button>
                            <button type="button" class="p-2 btn btn-outline-secondary btn-control col-md-3" data-toggle="modal" data-target="#delEntryModal">Supprimer des actifs</button>
                            <button type="button" class="p-2 btn btn-outline-secondary btn-control col-md-3" onclick="exportXLS();">Exporter en XLS</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class=" btn-group">
                            <button type="button" class="p-2 btn btn-outline-warning btn-control col-md-4" data-toggle="modal" data-target="#addOperationModal">Affecter à une opération</button>
                            <button type="button" class="p-2 btn btn-outline-danger btn-control col-md-4" data-toggle="modal" data-target="#addOperationModal" data-ops="MAINTENANCE">Passer en Maintenance</button>
                            <button type="button" class="p-2 btn btn-outline-success btn-control col-md-4" data-toggle="modal" data-target="#addOperationModal" data-ops="STOCK">Remettre en stock</button>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="row justify-content-around">
                            <h5>Filtres</h5>
                            <div class="btn-group">
                                <button type="button" class="btn btn-dark" id="add-filter" onclick="addField();">Ajouter un filtre</button>
                                <button type="button" class="btn btn-dark" onclick="addField('maintenance'); updateFilters();">M</button>
                                <button type="button" class="btn btn-dark" onclick="addField('stock'); updateFilters();">S</button>
                                <button type="button" class="btn btn-info" id="clear-filter" onclick="clearFilters();">Reset</button>
                            </div>
                        </div>

                    </div>
                    <div class="card-body">
                        <div id="entryNb"></div>
                        <div id="form-cont"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--   ---------------------------------- MODALS ---------------------------------- -->
        <div class="row justify-content-around">

            <!-- EDIT DRONE MODAL -->
            <div class="modal fade" id="editEntryModal" tabindex="-1" role="dialog" aria-labelledby="editEntryModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editEntryModal">Editer un actif</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body">
                            <div class="form-group card">
                                <div class="card-body">
                                    <div class="row justify-content-center" id="editLoadingSpinner">
                                        <div class="container">
                                            <div class="dot-container">
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                            </div>
                                            <div class="dot-container">
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                            </div>
                                            <div class="dot-container">
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <form id="editEntryForm" onsubmit="return false;">


                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                            <button type="button" class="btn btn-primary" data-dismiss="" onclick="validateForm(document.forms['editEntryForm'])">Editer</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PRINT MODAL -->
            <div class="modal fade" id="printModal" tabindex="-1" role="dialog" aria-labelledby="printModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="printModal">Imprimer une étiquette</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <!-- CREATE PDF MODAL BODY -->
                            <div class='col mb-3'>
                                <label for="labelTypeSelector">Type d'étiquette : </label>
                                <select class="form-control" id="labelTypeSelector" onchange="changeLabelTypeImg();">
                                    <option value="zephyr">Drone Zephyr</option>
                                    <option value="helios">Drone Helios</option>
                                    <option value="materiel">Materiel</option>
                                    <option value="bureautique">Bureautique</option>
                                </select>
                            </div>
                            <div class='col'>
                                <img src='assets/img/drone_zephyr.png' id="labelTypeImg">
                            </div>
                            <div class='col'>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                            <button type="button" class="btn btn-primary" onclick="printLabel();" data-dismiss="modal">Imprimer</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ADD ENTRY MODAL -->
            <div class="modal fade" id="addEntryModal" tabindex="-1" role="dialog" aria-labelledby="addEntryModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addEntryModal">Ajouter un actif</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body">
                            <!-- FORM SELECTOR -->
                            <div class="form-group">
                                <label for="entryType">Type d'actif : </label>
                                <select class="form-control" id="entryType" onchange="selectForm();"> <!-- Trigger la fonction selectForm() qui change la visibilité des formulaire selon le type d'actif choisi -->
                                    <option value="drone">
                                        Drone
                                    </option>
                                    <option value="equipement">
                                        Equipement
                                    </option>
                                </select>
                            </div>
                            <!-- FORM DRONE -->
                            <div class="form-group card">
                                <div class="card-body">
                                    <form id="droneForm" onsubmit="return validateForm(this, 'drone');">
                                        <?php createEntryForm("drones"); ?> <!-- Trigger le fichier add-entry-form.php-->
                                        <input type="submit" class="btn btn-primary" value="Ajouter">
                                        <input type="submit" class="btn btn-primary" value="Ajouter et Imprimer">
                                    </form>
                                    <!-- FORM EQUIPEMENT -->
                                    <form id="equipementForm" class="hide" onsubmit="return validateForm(this, 'equipement');">
                                        <?php createEntryForm("equip"); ?>
                                        <input type="submit" class="btn btn-primary" value="Ajouter">
                                        <input type="submit" class="btn btn-primary" value="Ajouter et Imprimer">
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ADD OPS MODAL -->
            <div class="modal fade" id="addOperationModal" tabindex="-1" role="dialog" aria-labelledby="addOperationModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addOperationModal">Affecter à une Opération</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="operationName">Nom de l'opération : </label>
                                <input class="form-control autocomplete" type="text" id="operationName">
                                <div class="input-group mt-3 mb-3">
                                    <input id="serialInput" type="text" onkeydown="onKeyDownInput('ops');" class="form-control" placeholder="Serial" aria-label="Serial" aria-describedby="basic-addon2">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" onclick="addEntryOpsList();">+</button>
                                    </div>
                                </div>
                                <div>
                                    <ul class="list-group" id="actList">

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="clearEntryList();">Fermer</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="addOpsButton();">Affecter à l'Opération</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DEL ENTRY MODAL -->
            <div class="modal fade" id="delEntryModal" tabindex="-1" role="dialog" aria-labelledby="delEntryModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="delEntryModal">Supprimer des actifs</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body">
                            <div class="input-group mt-3 mb-3">
                                <input id="serialInput2" type="text" onkeydown="onKeyDownInput('del');" class="form-control" placeholder="Serial" aria-label="Serial" aria-describedby="basic-addon2">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onclick="addEntryDelList();">+</button>
                                </div>
                            </div>
                            <div>
                                <ul class="list-group" id="delList">

                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="clearEntryList();">Fermer</button>
                            <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="delEntries();">Supprimer les actifs</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
</body>
<footer>
    <div style="height: 50px;"></div>
</footer>

</html>