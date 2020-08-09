![](https://www.st2msi.net/img/mocodo_js.svg)

Mocodo is a software to help teach and design relational databases (https://github.com/laowantong/mocodo).
(It is a tool that works according to part of the principles of the "Merise" method)

Mocodo{.js} uses the formalism of mocodo (same textual description) to construct the MCD (conceptual data model). 
- The online version is a "beta version".
- Errors are not managed.
- The code needs to be reworked.

The script is tested with Brave, Chrome, Edge and Firefox browsers (it doesn't work on Internet Explorer - use Edge or whatever).
- Input: the textual description of the entities and associations of the conceptual data model.
- Output: it produces its entity-association diagram in [SVG] which can be downloaded.
<h2>Online version</h2>
https://www.st2msi.net/mocodo_js/mocodo_js.html
You can train first with the original : http://www.mocodo.net/.
<h2>Example</h2>
<h3>Input</h3>
Adapted from a case study (BTS SIO SLAM AHM-23 - 2017).

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
<h3>Output</h3>

![](https://www.st2msi.net/img/AHM-23.svg)

<h2>Contribution of this version</h2>
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

