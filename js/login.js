// Fonction pour vérifier le login et le mot de passe
function checkLogin() {
    const loginInput = document.getElementById("login").value;
    const passwordInput = document.getElementById("password").value;

    const joueur = joueurs.find(joueur => joueur.login === loginInput && joueur.password === passwordInput);

    if (joueur) {
        // Stocker seulement les données primitives dans localStorage
        const joueurData = {
            login: joueur.login,
        };

        localStorage.setItem("joueurConnecte", JSON.stringify(joueurData));
        window.location.href = "accueil.html";  
    } else {
        alert("Login ou mot de passe incorrect !");
    }
    return false;  
}