class Personnage {
    constructor(metier, caractere, description, argent, biens, image) {
        this.image = image
        this.metier = metier;
        this.caractere = caractere;
        this.description = description;
        this.argent = argent;
        this.biens = biens;
        this.pretActif = null;
    }

    afficherFiche() {
        document.getElementById("metier").textContent = this.metier;
        document.getElementById("metier").textContent += " " + this.caractere;
        document.getElementById("argent-joueur").textContent = this.argent.toFixed(2);
        document.getElementById("biens-joueur").textContent = this.biens.length > 0 ? this.biens.join(", ") : "-";

        const imageElement = document.getElementById("image-personnage");
        if (this.image) {
            imageElement.src = this.image;
            imageElement.style.display = "block";
        } else {
            imageElement.style.display = "none";
        }

        this.afficherActionSpecifiques();
    }

    afficherActionSpecifiques(){
        const actionsContainer = document.getElementById("actions-container");
        actionsContainer.innerHTML = '';

        if (this.pretActif) {
            const remboursementBtn = document.createElement("a");
            remboursementBtn.href = "#";
            remboursementBtn.classList.add("action-btn");
            remboursementBtn.textContent = `Reste à rembourser à ${this.pretActif.banquier.metier}: ${this.pretActif.montantRestant.toFixed(2)} $`;

            remboursementBtn.addEventListener("click", () => {
                const montantRembourse = parseFloat(prompt("Entrez le montant que vous souhaitez rembourser :"));
                if (!isNaN(montantRembourse) && montantRembourse > 0) {
                    this.rembourserPret(montantRembourse);
                } else {
                    alert("Montant de remboursement invalide.");
                }
            });

            actionsContainer.appendChild(remboursementBtn);
        }
    }

    optionContextuelles(){
        return null
    }

    rembourserPret(montant) {
        if (this.pretActif) {
            const montantRestant = this.pretActif.montantRestant;

            if (montant > montantRestant) {
                alert("Vous ne pouvez pas rembourser plus que le montant restant.");
                return;
            }

            // Mettre à jour les montants
            this.pretActif.montantRestant -= montant;
            this.argent -= montant;
            this.pretActif.banquier.argent += montant;

            alert(`Vous avez remboursé ${montant.toFixed(2)} $. Montant restant à rembourser : ${this.pretActif.montantRestant.toFixed(2)} $`);

            if (this.pretActif.montantRestant <= 0) {
                alert("Votre prêt est maintenant entièrement remboursé.");
                this.pretActif = null; 
            }

            mettreAJourAffichage();
        }
    }
}