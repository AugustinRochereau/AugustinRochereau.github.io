// Informations du joueur en localStorage
var joueurData = JSON.parse(localStorage.getItem("joueurConnecte"));
var joueurPrincipal = joueurs.find(j => j.login === joueurData.login);

if (!joueurPrincipal) {
    // Redirection vers la page de login si pas de joueur
    alert("Aucun joueur connecté. Veuillez vous reconnecter.");
    window.location.href = "index.html"; 
} else {
    mettreAJourAffichage();
}

function mettreAJourAffichage() {
    joueurPrincipal.personnage.afficherFiche();
    afficherJoueurs();
}

function afficherPopup() {
    document.getElementById("fiche-popup").style.display = "flex";
    document.getElementById("description-fiche").textContent =
        `Vous êtes ${joueurPrincipal.personnage.metier} avec le trait de caractère ${joueurPrincipal.personnage.caractere}! ${joueurPrincipal.personnage.description}`;
}

function fermerPopup() {
    document.getElementById("fiche-popup").style.display = "none";
}

// Fonction pour afficher les autres joueurs avec un clic sur le nom
function afficherJoueurs() {
    var listeJoueurs = document.getElementById("liste-joueurs");
    listeJoueurs.innerHTML = '';
    joueurs.forEach(function(joueur) {
        if (joueur.login !== joueurPrincipal.login) {
            var li = document.createElement("li");
            li.textContent = `${joueur.login} (${joueur.personnage.metier}) - ${joueur.personnage.argent.toFixed(2)} $`;

            // Ajouter l'événement de clic pour afficher le menu contextuel
            li.addEventListener("click", function(event) {
                event.stopPropagation();  
                afficherMenuContextuel(joueur, event.pageX, event.pageY)
            });

            listeJoueurs.appendChild(li);
        }
    });
}

// Fonction pour afficher le menu contextuel avec les options
function afficherMenuContextuel(joueurSelectionne, x, y) {
    var menu = document.getElementById("menu-contextuel");
    var options = document.getElementById("menu-options");
    options.innerHTML = ''; 

    // Option pour incarner le joueur
    var optionIncarner = document.createElement("li");
    optionIncarner.textContent = "Incarner ce joueur";
    optionIncarner.addEventListener("click", function() {
        incarnerJoueur(joueurSelectionne);
        cacherMenuContextuel();
    });
    options.appendChild(optionIncarner);

    var optionPersonnage = joueurSelectionne.personnage.optionContextuelles(joueurPrincipal, gameData["jourActuel"]);
    if (optionPersonnage) {
        options.appendChild(optionPersonnage);
    }

    // Afficher le menu à la position du clic
    menu.style.display = "block";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
}

// Fonction pour cacher le menu contextuel
function cacherMenuContextuel() {
    var menu = document.getElementById("menu-contextuel");
    menu.style.display = "none";
}

// Fonction pour incarner un joueur différent (pour les tests)
function incarnerJoueur(joueur) {
    joueurPrincipal = joueur;  
    joueurPrincipal.afficherFiche();  
    afficherJoueurs();  
}

// Fonction pour afficher le jour de la partie et révéler la section d'enchères le dernier jour
function afficherJourPartie() {
    document.getElementById("jour-partie").textContent = `Jour ${gameData["jourActuel"]}/${gameData["totalJours"]}`;
    
    // Révéler la section d'enchères seulement au dernier jour
    if (gameData["jourActuel"] === gameData["totalJours"]) {
        document.getElementById("enchere-section").style.display = "block"; 
    } else {
        document.getElementById("enchere-section").style.display = "none"; 
    }
}

var timerActif = true; 
var interval; 

// Fonction pour gérer le compte à rebours
function demarrerTimer(duree) {
    var tempsRestant = duree * 60; 

    interval = setInterval(function() {
        if (timerActif) {
            var minutes = Math.floor(tempsRestant / 60);
            var secondes = tempsRestant % 60;

            // Afficher le temps restant
            document.getElementById("timer").textContent = `${minutes}:${secondes < 10 ? '0' : ''}${secondes}`;

            if (tempsRestant <= 0) {
                clearInterval(interval);
                passerAuJourSuivant();
            }

            tempsRestant--; 
        }
    }, 1000);
}

function togglePauseTimer() {
    timerActif = !timerActif;
    document.getElementById("pause-timer-btn").textContent = timerActif ? "Pause" : "Reprendre";
}

function placerEnchere() {
    var montantEnchere = parseFloat(document.getElementById("enchere-montant").value);
    
    if (isNaN(montantEnchere) || montantEnchere <= gameData["enchereMax"].montant) {
        alert("Votre enchère doit être supérieure à l'enchère actuelle.");
    } else if (montantEnchere > joueurPrincipal.personnage.argent) {
        alert("Vous n'avez pas assez d'argent pour cette enchère.");
    } else {
        // Placer l'enchère
        gameData["enchereMax"].joueur = joueurPrincipal.login;
        gameData["enchereMax"].montant = montantEnchere;
        document.getElementById("enchere-actuelle").textContent = `Enchère actuelle : ${gameData["enchereMax"].joueur} avec ${gameData["enchereMax"].montant} $`;
    }
}

function passerAuJourSuivant() {
    if (gameData["jourActuel"] < gameData["totalJours"]) {
        gameData["jourActuel"]++;
        afficherJourPartie();
        demarrerTimer(gameData["dureeJourneeMinutes"]); 
        joueurs.forEach(joueur => {
            if (joueur.personnage instanceof Banquier) {
                joueur.personnage.aDejaPreteAujourdHui = false;
            }
        });
    } else {
        determinerGagnant();
    }
}

function determinerGagnant() {
    if (gameData["enchereMax"].joueur) {
        document.getElementById("gagnant-message").textContent = `${gameData["enchereMax"].joueur} a gagné l'objet aux enchères avec ${gameData["enchereMax"].montant} $ !`;
    } else {
        document.getElementById("gagnant-message").textContent = "Aucun joueur n'a placé d'enchère.";
    }

    document.getElementById("gagnant-popup").style.display = "flex";
}

// Menu contextuel
document.addEventListener("click", function(event) {
    var menu = document.getElementById("menu-contextuel");
    if (!menu.contains(event.target)) {
        cacherMenuContextuel();
    }
});

// Charger les informations du joueur et des autres joueurs à l'initialisation
document.addEventListener("DOMContentLoaded", function () {
    joueurPrincipal.afficherFiche();
    afficherJoueurs();
    afficherJourPartie();

    document.getElementById("info-btn").addEventListener("click", afficherPopup);
    document.getElementById("close-popup").addEventListener("click", fermerPopup);
    
    document.getElementById("placer-enchere-btn").addEventListener("click", placerEnchere);

    document.getElementById("pause-timer-btn").addEventListener("click", togglePauseTimer);

    // Afficher la pop-up de la fiche lors de la première connexion
    afficherPopup();

    demarrerTimer(gameData["dureeJourneeMinutes"]);
});