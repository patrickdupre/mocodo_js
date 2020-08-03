# mocodo_js
![](https://cdn.rawgit.com/laowantong/mocodo/master/logos/banner.svg)


Mocodo_js est un composant d'aide à l'enseignement et à la conception des bases de données relationnelles.
La version en ligne est une "version beta" (le script est directement intégré au html, les erreurs ne sont pas gérées et le code doit être remanié).

(http://www.lsis.org/espinasseb/LivreMerise/LivreMerisePDF-total-12sept14.pdf).

L'outil se base sur MOCODO : https://github.com/laowantong/mocodo

- En entrée, il prend une description textuelle des entités et associations du modèle conceptuel de données ([MCD](https://fr.wikipedia.org/wiki/Modèle_entité-association)).
- En sortie, il produit son diagramme entité-association en [SVG](https://fr.wikipedia.org/wiki/Scalable_Vector_Graphics).

Ci-dessous, un exemple généré sur Chrome, testé sur Firefox et Edge. Il reprend une étude de cas de BTS SIO SLAM.

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

![](https://st2msi.net/img/AMH-23.svg)

La devise de Mocodo, « nickel, ni souris », en résume les principaux points forts:

- description textuelle des données. L'utilisateur n'a pas à renseigner, placer et déplacer des éléments comme avec une lessive ordinaire. Il ne fournit rien de plus que les informations définissant son MCD. L'outil s'occupe tout seul du plongement;
- propreté du rendu. La sortie se fait en vectoriel, prête à être affichée, imprimée, agrandie, exportée dans une multitude de formats sans perte de qualité;

Mocodo est libre, gratuit et multiplateforme. Si vous l'aimez, répandez la bonne nouvelle en incluant l'un de ses logos dans votre support: cela multipliera ses chances d'attirer des contributeurs qui le feront évoluer.

Pour vous familiariser avec Mocodo, le mieux est d'utiliser [sa version en ligne](http://mocodo.net).

Pour en savoir plus, lisez la documentation [au format HTML](https://rawgit.com/laowantong/mocodo/master/doc/fr_refman.html) ou téléchargez-la [au format Jupyter Notebook](doc/fr_refman.ipynb).
