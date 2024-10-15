class Joueur {
    constructor(login, password, personnage){
        this.login = login;
        this.password = password;
        this.personnage = personnage;
    }

    // Fonction pour afficher la fiche du joueur connecté
    afficherFiche() {
        document.getElementById("login-joueur").textContent = this.login;
        this.personnage.afficherFiche();
    }
}

const joueurs = [
    new Joueur("Bulbizarre", "1234", new Banquier("Normie")),
    new Joueur("Salameche", "1234", new VendeurTrombones("Normie")),
    new Joueur("Carapuce", "1234", new VendeurTrombones("Normie")),
    new Joueur("Roucool", "1234", new Gangster("Malicieux"))
]

console.log(joueurs)