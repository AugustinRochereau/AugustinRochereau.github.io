class Gangster extends Personnage {
    constructor(caractere) {
        super(
            "Gangster",
            caractere,
            "Le gangster n'est pas du genre à suivre les règles. Chaque jour, il peut tenter de voler de l'argent à un autre joueur. Cependant, il prend le risque de se faire attraper.",
            3000,
            [],
            "images/gangster.png",
        );
    }

    afficherFiche() {
        super.afficherFiche();
        this.afficherActionSpecifiques();
    }

    afficherActionsSpecifiques() {
        console.log("Affichage des actions spécifiques pour le gangster.");
        const actionsContainer = document.getElementById("actions-container");

        const volerBtn = document.createElement("a");
        volerBtn.href = "#";
        volerBtn.classList.add("action-btn");
        volerBtn.textContent = "Voler un joueur (10 %)";
        
        volerBtn.addEventListener("click", () => {
            const joueurCibleLogin = prompt("Entrez le login du joueur à voler :");
            const joueurCible = joueurs.find(j => j.login === joueurCibleLogin);
            
            if (joueurCible) {
                this.volerJoueur(joueurCible);
            } else {
                alert("Joueur non trouvé !");
            }
        });
        actionsContainer.appendChild(volerBtn);
    }

    volerJoueur(joueurCible) {
        const chance = Math.random();
        const montantVol = joueurCible.personnage.argent * 0.1;

        if (chance < 0.5) {
            // Réussite du vol
            joueurCible.personnage.argent -= montantVol;
            this.argent += montantVol;
            alert(`Vous avez volé ${montantVol.toFixed(2)} $ à ${joueurCible.login} !`);
        } else {
            // Échec du vol, le gangster perd de l'argent
            const amende = 200;
            this.argent -= amende;
            alert(`Vous vous êtes fait attraper ! Vous perdez ${amende.toFixed(2)} $.`);
        }

        this.afficherFiche();
        afficherJoueurs();
    }
}