class VendeurTrombones extends Personnage{
    constructor(caractere){
        super("Vendeur de trombones",    
        caractere,                 
        "Bon courage pour s'enrichir par cette voie là!", 
        15.00,                     
        [],
        "images/vendeur_trombones.png")
    }

    afficherActionSpecifiques(){
        super.afficherActionSpecifiques();

        const actionsContainer = document.getElementById("actions-container");
        const vendreBtn = document.createElement("a");
        vendreBtn.href = "#";
        vendreBtn.classList.add("action-btn");
        vendreBtn.textContent = "Vendre un trombone™ (100 $)";
        
        vendreBtn.addEventListener("click", () => {
            this.argent += 100;
            alert("Vous avez vendu un trombone™ !");
            this.afficherFiche();
        });
        actionsContainer.appendChild(vendreBtn);  

        const vendreBtnGold = document.createElement("a");
        vendreBtnGold.href = "#";
        vendreBtnGold.classList.add("action-btn");
        vendreBtnGold.textContent = "Vendre un trombone gold™ (1000 $)";
        
        vendreBtnGold.addEventListener("click", () => {
            this.argent += 1000;
            alert("Vous avez vendu un trombone gold™ !");
            this.afficherFiche();
        });
        actionsContainer.appendChild(vendreBtnGold);         
    }
}