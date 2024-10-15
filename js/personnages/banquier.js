class Banquier extends Personnage {
    constructor(caractere){
        super("Banquier",
        caractere, 
        "Le banquier peut contracter un prêt chaque jour sur la demande d'un autre joueur. Les prêts doivent être remboursés avant le 7e jour sur la base d'un intérêt croissant.",
        5000,
        [],
        "images/jadore_largent.png")
        this.aDejaPreteAujourdHui = false;
        this.demandesPrets = [];
    }

    afficherActionSpecifiques(){
        super.afficherActionSpecifiques();

        const actionsContainer = document.getElementById("actions-container");
        if (this.demandesPrets.length > 0) {
            this.demandesPrets.forEach(demande => {
                const demandeBtn = document.createElement("a");
                demandeBtn.href = "#";
                demandeBtn.classList.add("other-btn");
                demandeBtn.textContent = `Demande de prêt de ${demande.joueur.login}: ${demande.montant.toFixed(2)} $`;

                demandeBtn.addEventListener("click", () => {
                    this.accepterDemande(demande.joueur, demande.montant, demande.tauxInteret);
                });

                actionsContainer.appendChild(demandeBtn);
            });
        }        
    }

    optionContextuelles(joueurDemandeur, jourActuel) {
        var optionPret = document.createElement("li");
        optionPret.textContent = this.aDejaPreteAujourdHui ? "Prêt indisponible" : "Contracter un prêt";
        if (!this.aDejaPreteAujourdHui) {
            optionPret.addEventListener("click", () => {
                this.demanderPret(joueurDemandeur, jourActuel);
                cacherMenuContextuel();
            });
        } else {
            optionPret.style.color = "gray";
        }
        return optionPret;
    }

    // ==================== PRETS DU BANQUIER ====================
    // Méthode pour demander un prêt
    demanderPret(joueur, jourActuel) {
        const demandeExistante = this.demandesPrets.find(demande => demande.joueur.login === joueur.login);
        if (demandeExistante) {
            alert(`${joueur.login} a déjà une demande de prêt en cours.`);
            return;
        }
        const tauxInteret = 1 + jourActuel * 0.1;
        const montant = parseFloat(prompt(`Taux d'intérêt actuel : ${tauxInteret * 100}%. Entrez le montant que vous souhaitez emprunter :`));
        
        if (!isNaN(montant) && montant > 0) {
            this.ajouterDemandePret(joueur, montant, tauxInteret);  
            alert(`Demande de prêt de ${montant} $ envoyée au banquier.`);
        } else {
            alert("Montant de prêt invalide.");
        }
    }

    ajouterDemandePret(joueur, montant, tauxInteret){
        this.demandesPrets.push({joueur, montant, tauxInteret})
    }

    accepterDemande(joueur, montant, tauxInteret) {
        if (!this.aDejaPreteAujourdHui) {
            const montantTotal = montant * tauxInteret;
    
            joueur.personnage.pretActif = {
                banquier: this, 
                montantInitial: montant,
                montantRestant: montantTotal
            };
    
            joueur.personnage.argent += montant;
            this.argent -= montant;
            this.aDejaPreteAujourdHui = true;
    
            this.demandesPrets = [];
    
            alert(`Prêt de ${montant} $ accordé à ${joueur.login} avec un remboursement de ${montantTotal.toFixed(2)} $.`);
            mettreAJourAffichage();
        } else {
            alert("Vous avez déjà prêté aujourd'hui.");
        }
    }
}