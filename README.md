![](https://www.st2msi.net/img/mocodo_js.svg)

Mocodo_js est un composant d'aide à l'enseignement et à la conception des bases de données relationnelles.
(http://www.lsis.org/espinasseb/LivreMerise/LivreMerisePDF-total-12sept14.pdf).

La version en ligne est une "version beta" (le script est directement intégré au html, les erreurs ne sont pas gérées et le code doit être remanié).

L'outil se base sur MOCODO : https://github.com/laowantong/mocodo. 
- En entrée, il prend une description textuelle des entités et associations du modèle conceptuel de données ([MCD](https://fr.wikipedia.org/wiki/Modèle_entité-association)).
- En sortie, il produit son diagramme entité-association en [SVG](https://fr.wikipedia.org/wiki/Scalable_Vector_Graphics).
<h2>Version en ligne</h2>
https://www.st2msi.net/mocodo_js/mocodo_js.html
Vous pouvez vous entrainer d'abord avec l'original  sur http://www.mocodo.net/.
<h2>Exemple</h2>
<h3>Description textuelle</h3>
Adaptée d'une étude de cas de BTS SIO SLAM (Cas AHM-23 - session 2017).

    EssenceBois: id, libelle
    :
    :
    Constituer, 0N EssenceBois, 11 MatierePremiere

    :
    Composant: id, libelle, longueur, largeur, epaisseur
    Decouper, 1N Composant, ON MatierePremiere: quantiteDecoupee, longueurPerte, longueurChute
    MatierePremiere:id, libelle, longueur, largeur, epaisseur, idEssence
    Stock,0N MatierePremiere, 0N Site : stockActuel, stockAlerte
    Site: code, nom

    dans une, 0N EssenceBois, 11 ModelePalette
    composer, 0N Composant, 0N ModelePalette: Qantite
    LigneCommande,0N ModelePalette, 0N Commande: quantiteCommandee, prixUnitaireFacture, estFabrique
    :
    associer, 11 Client, 0N Site
    travailler, 0N Site, 11 Utilisateur

    : 
    ModelePalette: id, designation, longueur, largeur, poidsCharge, coutRevient, type, nomFichierPdf
    Commande: id, dateCommande, dateLivraisonPrevue, dateLivraisonReelle
    passer, 11 Commande, 0N Client
    Client:numero, raisonSociale, adresseRue, codePostal, ville, telephone, courriel, imageLogo
    Utilisateur: login, motDePasse, nom, prenom

    :
    XT, &&> ModelePalette, && Standard, && Personalisee
    :
    demander, 11 Personalisee, 0N Client

    Standard: &refCatalogue
    :
    Personalisee: &dateApplication, dateCreation, contact

    En sortie, le MCD (diagramme conceptuel):
<h3>Shéma généré</h3>

![](https://www.st2msi.net/img/AHM-23.svg)

<h2>Apport de la version</h2>
<ul>
    <li>La généralisation/spécialisation s'exprime par des relations notées <code>XT</code>,<code>T</code>,<code>X</code> ou <code> </code>.</li>
    <li>Ces relations recoivent  alors des cardinalités notées <code>&&</code> (évite l'affichage des cardinalités).</li>
    <li>La première propriété des entitées "sous type" est  précédée  d'un <code>&</code> (le <code>&</code> évite le soulignement).</li>
    <li>exemple: <code>XT, &&> ModelePalette, && Standard, && Personalisee</code>.</li>
    <li><code>, &&> ModelePalette, && Standard, && Personalisee</code> affichera un triangle vide.</li>
    <li>Bibliographie : INGENIERIE DES SYSTEMES D’INFORMATION : MERISE DEUXIEME GENERATION 4°édition</li>
    <li>http://www.lsis.org/espinasseb/LivreMerise/LivreMerisePDF-total-12sept14.pdf</li>
</ul>
<h2>Installation en local</h2>
<ul>
    <li>Vous devez avoir un serveur http installé et opérationnel</li>
    <li>Télécharger le code via Github</li>
    <li>Décompresser le fichier à la racine du serveur</li>
    <li>Appeler le fichier mocodo_js.html depuis votre navigateur</li>
<ul>

