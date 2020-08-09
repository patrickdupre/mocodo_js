![](https://www.st2msi.net/img/mocodo_js.svg)

Mocodo is a software to help teach and design relational databases (https://github.com/laowantong/mocodo).
(This tool works according to a part of the principles of the "Merise" method : https://en.wikipedia.org/wiki/Merise)

Mocodo{.js} uses the formalism of mocodo (same textual description) to construct the MCD (conceptual data model). With Mocodo{.js}, the client browser is working, not the server.
- The online version is a "beta version".
- Errors are not managed.
- The code needs to be reworked.

The script is tested with Brave, Chrome, Edge and Firefox browsers (it doesn't work on Internet Explorer - use Edge or whatever).
- Input: the textual description of the entities and associations of the conceptual data model.
- Output: it produces its entity-association diagram in [SVG] which can be downloaded.
<h2>Online version</h2>
https://www.st2msi.net/mocodo_js/mocodo_js.html
You can train first with the original : http://www.mocodo.net/.
<h2>Contributions of this version</h2>
<ul>
    <li>Generalization/specialization (heritage) is expressed through relationships: <code>XT</code>,<code>T</code>,<code>X</code> or <code> </code>.</li>
    <li>These relations receive the cardinalities <code>&&</code> (avoids displaying cardinalities).</li>
    <li>The first property of "subtype" entities is preceded by a <code>&</code> (le <code>&</code> avoid underlining).</li>
    <li>example: <code>XT, &&> ModelePalette, && Standard, && Personalisee</code>.</li>
    <li><code>, &&> ModelePalette, && Standard, && Personalisee</code> will display an empty triangle.</li>
</ul>
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
<h3>Output</h3>

![](https://www.st2msi.net/img/AHM-23.svg)

<h2>Local install</h2>
<ul>
    <li>You need to have an installed and operational http server</li>
    <li>Download the code via Github</li>
    <li>Unzip the file at the server's root</li>
    <li>Call the file mocodo_js.html from your browser</li>
</ul>
<h2>Bibliography</h2>
<ul>
    <li>INGENIERIE DES SYSTEMES D’INFORMATION : MERISE DEUXIEME GENERATION (http://www.lsis.org/espinasseb/LivreMerise/LivreMerisePDF-total-12sept14.pdf</li>
    <li>Jean-Luc Hainaut (2018), Bases de données - 4e édition - Concepts, utilisation et développement (InfoSup, Dunod)</li>
    <li>Joseph Gabay (2001), Merise et UML pour la modélisation des systèmes d'information - Un guide complet avec études de cas, (Informatique, Dunod)</li>
</ul>
<h2>References</h2>
<ul>
    <li>Icons : inspired and adapted from https://github.com/FortAwesome</li>
    <li>https://developer.mozilla.org/en-US/</li>
    <li>https://www.w3.org/</li>
</ul>
