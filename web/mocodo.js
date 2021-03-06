/*! mocodo_js version 0.1-beta
* https://github.com/patrickdupre/mocodo_js
* Copyright 2020 Patrick DUPRE under the MIT license
* 
* TàF:
* Séparer présentation et traitement
* Structurer et finaliser les objets
*/
"use strict";
var elm_style = '#frame {fill: #color;  stroke:none; stroke-width:0}\n' +
	'.circle_ts {fill:none; stroke:navy; stroke-width:1px}\n' +
	'.asso_text {fill:#color; font-family: #font_family ; font-size:#font_sizepx;}\n' +
	'.ent_text {fill:#color; font-family: #font_family ; font-size:#font_sizepx;}\n' +
	'.lien_text {fill:#color; font-family: #font_family ; font-size:#font_sizepx;}\n' +
	'.asso_top {fill:#color; stroke:#color; stroke-width:0}\n' +
	'.asso_bot {fill:#color; stroke:#color; stroke-width:0}\n' +
	'.asso_df {fill:#color; stroke:#stroke_color; stroke-width:#stroke_widthpx}\n' +
	'.asso_sep {stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.asso_bord {rx:#radius; fill:none; stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.lien_droit {stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.lien_curv {fill:none; stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.lien_arrow {fill:#color; stroke-width:0}\n' +
	'.lien_soul {stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.ent_top {fill:#color; stroke:#color; stroke-width:0}\n' +
	'.ent_sep {stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.ent_bot {fill:#color; stroke:#color; stroke-width:0}\n' +
	'.ent_bord { fill:none; stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.ent_soul {stroke:#color; stroke-width:#stroke_widthpx}\n' +
	'.ent_tiret {fill:none;stroke:#color;stroke-width:#stroke_widthpx;stroke-dasharray:#stroke_dasharraypx}';
var svg_style ="";
var calque_texte ="",calque_forme ="",calque_lien ="";
var fontLoaded = false, colorLoaded = false;
var margin_size = 0, elt_marg_hb = 0, elt_marg_gd = 0, ligne_skip = 0, box_stroke = 0, box_sep =0,soul_haut=0,  asso_radius =0;
var asso_haut_txt = 0, ent_haut_txt = 0, lienHautTxt = 0, lienLongTxt = 0, nb_col=0,nb_row=0;
var min_box_haut = 0;
loadParam();
function displayPane(panel) {
	document.getElementById("aboutContents").style.display = "none";
	document.getElementById("inputContents").style.display = "none";
	document.getElementById("paramContents").style.display = "none";
	document.getElementById(panel).style.display = "block";
}
function getFileAjx(fichier, writeFunction) {
	var infoLu = new XMLHttpRequest();
	infoLu.onreadystatechange = function () {	if (this.readyState === 4 && this.status === 200) writeFunction(this);}
	infoLu.open("GET", fichier, true); infoLu.send(fichier);
}
function loadFont(font) {fontLoaded = false; getFileAjx("./mocodo/shapes/"+font+".json",writeFont); }
function loadColor(color) {colorLoaded = false; getFileAjx("./mocodo/colors/"+color+".json",writeColor);}
function loadParam() {svg_style=elm_style; loadFont(document.getElementById("shapes").value); loadColor(document.getElementById("colors").value);}
function downloadSVG() {
	if (window.navigator.msSaveOrOpenBlob) { // for edge
		var blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n'+out_svg], { type: "text/plain;charset=utf-8"});
		window.navigator.msSaveBlob(blob, document.getElementById("title").value+".svg");
		blob = "";
	} else {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>\n'+out_svg));
		element.setAttribute('download', document.getElementById("title").value+".svg");
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
}
function writeFont(font) {
	var style = svg_style.split("\n"), tmpFont =[], ligne = "",i=0;tmpFont=font.responseText.split("\n");
	for (i in tmpFont) {
		tmpFont[i]=tmpFont[i].replace(/ /g, "");
		if(tmpFont[i].search(':{"family":')>=0) {
			tmpFont[i]=tmpFont[i].replace(/:{"family":/gim, ':{"police":{"family":');
			if(tmpFont[i].endsWith(",") == true ) {
				tmpFont[i]=tmpFont[i].replace(/},$/, '}},');
			} else {
				tmpFont[i]=tmpFont[i].replace(/}$/, '}}');
			}
		}
	}
	try {
		tmpFont= JSON.parse(tmpFont.join(""));
	} catch(err) {
		alert("ERREUR fichier parametre "+err.message);
	}
	var tmp_elt = "";
	var in_line = "";
	for (i in style) {
		tmp_elt = style[i].split(" ")[0].trim();
		if(tmp_elt==".asso_text") {style[i]=style[i].replace(/#font_family/g, tmpFont["association_cartouche_font"].police["family"]);
			style[i]=style[i].replace(/#font_size/g, tmpFont["association_cartouche_font"].police["size"]); continue;
		} else if (tmp_elt==".ent_text") {style[i]=style[i].replace(/#font_family/g, tmpFont["entity_cartouche_font"].police["family"]);
			style[i]=style[i].replace(/#font_size/g, tmpFont["entity_cartouche_font"].police["size"]); continue;
		} else if (	tmp_elt==".lien_text") {style[i]=style[i].replace(/#font_family/g, tmpFont["card_font"].police["family"]);
			style[i]=style[i].replace(/#font_size/g, tmpFont["card_font"].police["size"]); continue;
		} else if (tmp_elt==".asso_df" || tmp_elt==".asso_bord" || tmp_elt==".ent_bord") {style[i]=style[i].replace(/#stroke_width/g, tmpFont["box_stroke_depth"]);
			if (tmp_elt==".asso_bord") style[i]=style[i].replace(/#radius/g, tmpFont["round_corner_radius"]); continue;
		} else if (tmp_elt==".asso_sep" || tmp_elt==".ent_sep") {style[i]=style[i].replace(/#stroke_width/g, tmpFont["inner_stroke_depth"]); continue;
		} else if (tmp_elt==".lien_droit" || tmp_elt==".lien_curv") {style[i]=style[i].replace(/#stroke_width/g, tmpFont["leg_stroke_depth"]); continue;
		} else if (tmp_elt==".lien_soul" || tmp_elt==".ent_soul" || tmp_elt==".ent_tiret") {style[i]=style[i].replace(/#stroke_width/g, tmpFont["underline_depth"]);
			if (tmp_elt==".ent_tiret") style[i]=style[i].replace(/#stroke_dasharray/g, tmpFont["dash_width"]); continue;
		}
	}
	margin_size = tmpFont["margin_size"]; elt_marg_hb = tmpFont["rect_margin_height"];
	elt_marg_gd = tmpFont["rect_margin_width"]; ligne_skip = tmpFont["line_skip_height"];
	box_stroke = tmpFont["box_stroke_depth"]; soul_haut = tmpFont["underline_depth"];
	box_sep = tmpFont["inner_stroke_depth"]; asso_radius = tmpFont["round_corner_radius"];
	svg_style = style.join("\n"); fontLoaded = true;
}
function writeColor(color) {
	var jsonColor =color.responseText;
	var style = svg_style.split("\n");
	var tmpColor =[], ligne = "",i=0;
	tmpColor=color.responseText.split("\n");
	 try {
		tmpColor= JSON.parse(tmpColor.join(""));
	} catch(err) {
		alert("ERREUR fichier parametre "+err.message);
	}
	var tmp_elt = "";
	var in_line = "";
	for (i in style) {
		tmp_elt = style[i].split(" ")[0].trim();
		if(tmp_elt=="#frame") {style[i]=style[i].replace(/#color/g, tmpColor["background_color"]);	continue;
		} else if(tmp_elt==".asso_text") {style[i]=style[i].replace(/#color/g, tmpColor["association_attribute_text_color"]); continue;
		} else if(tmp_elt==".ent_text"  || tmp_elt==".ent_soul" || tmp_elt==".ent_tiret") {
			style[i]=style[i].replace(/#color/g, tmpColor["entity_attribute_text_color"]); continue;
		} else if(tmp_elt==".lien_text" || tmp_elt==".lien_soul") {style[i]=style[i].replace(/#color/g, tmpColor["card_text_color"]); continue;
		} else if(tmp_elt==".asso_top") {style[i]=style[i].replace(/#color/g, tmpColor["association_cartouche_color"]); continue;
		} else if(tmp_elt==".asso_bot") {style[i]=style[i].replace(/#color/g, tmpColor["association_color"]); continue;
		} else if(tmp_elt==".asso_df") {style[i]=style[i].replace(/#color/g, tmpColor["association_color"]);
			style[i]=style[i].replace(/#stroke_color/g, tmpColor["association_stroke_color"]); continue;
		} else if(tmp_elt==".asso_sep" || tmp_elt==".asso_bord") {style[i]=style[i].replace(/#color/g, tmpColor["association_stroke_color"]); continue
		} else if(tmp_elt==".lien_droit" || tmp_elt==".lien_curv" || tmp_elt==".lien_arrow") {
			style[i]=style[i].replace(/#color/g, tmpColor["leg_stroke_color"]); continue
		} else if(tmp_elt==".ent_top") {style[i]=style[i].replace(/#color/g, tmpColor["entity_cartouche_color"]); continue;
		} else if(tmp_elt==".ent_bot") {style[i]=style[i].replace(/#color/g, tmpColor["entity_color"]); continue;
		} else if(tmp_elt==".ent_sep" || tmp_elt==".ent_bord") {style[i]=style[i].replace(/#color/g, tmpColor["entity_stroke_color"]); continue
		}
	}
	svg_style = style.join("\n");
	colorLoaded = true;
}

//document.getElementById("text").value  = "TROC, 0N> ESPÈCE\n\nESPÈCE: code espèce, libellé\nDF, 0N ESPÈCE, _11> ANIMAL\nANIMAL: nom, sexe, date naissance, date décès\nA MÈRE, 01 ANIMAL, 0N> [mère] ANIMAL\n\nTRUC, 0N> ESPÈCE\n:\nA PÈRE, 0N> ANIMAL, 0N> [père présumé] ANIMAL";
//document.getElementById("text").value = "\nSAISON, 0N> PÉRIODE, 1N> PÉRIODE\nOCCUPE, 1N> ANIMAL, 1N> PÉRIODE, 1N> ENCLOS\nENCLOS: num.e\n\nPÉRIODE: date début, _date fin\n\nOUPS,0N> PÉRIODE,0N> ANIMAL\n:\nTRUC,0N> ESPÈCE,0N> ESPÈCE,0N> ANIMAL\nPEUT VIVRE DANS, 1N> ESPÈCE, 1N> ENCLOS: nb. max. congénères, commentaire\nBOUM,0N> ESPÈCE,0N> ESPÈCE\n\nA MÈRE, 01> ANIMAL, 0N> [mère] ANIMAL\nANIMAL: nom, sexe, date naissance, date décès\nDF, 0N> ESPÈCE, _11> ANIMAL\nESPÈCE: code espèce, libellé\nSOUS ESPÈCE DE, 0N> ESPÈCE, 0N> ESPÈCE\n\nBÊTE,0N> ANIMAL\nA PÈRE, 0N> ANIMAL, 0N> [père présumé] ANIMAL\nPEUT COHABITER AVEC, 0N> ESPÈCE, 0N> [commensale] ESPÈCE: nb. max. commensaux, commentaire\nBOF, 0N> ESPÈCE\nARG,0N> ESPÈCE,0N> ESPÈCE";
//document.getElementById("text").value  = "PEUT VIVRE DANS, 1N ESPÈCE, 1N ENCLOS: nb. max. congénères\nENCLOS: num. enclos\nOCCUPE, 1N ANIMAL, 1N PÉRIODE, 1N ENCLOS\nPÉRIODE: date début, _date fin\n\nESPÈCE: code espèce, libellé\nDF, 0N ESPÈCE, _11 ANIMAL\nANIMAL: nom, sexe, date naissance, date décès\nA MÈRE, 01 ANIMAL, 0N> [mère] ANIMAL\n\nPEUT COHABITER AVEC, 0N ESPÈCE, 0N [commensale] ESPÈCE: nb. max. commensaux\n:\nA PÈRE, 0N> ANIMAL, 0N> [père présumé] ANIMAL\nPARENT, 11 A PÈRE, 11 A MÈRE";
//document.getElementById("text").value = "PEUT VIVRE DANS, 1N ESPÈCE, 1N ENCLOS: nb. max. congénères\nENCLOS: num. enclos\nOCCUPE, 1N ANIMAL, 1N PÉRIODE, 1N ENCLOS\nPÉRIODE: date début, _date fin\n\nESPÈCE: code espèce, libellé\nDF, 0N ESPÈCE, _11 ANIMAL\nANIMAL: nom, sexe, date naissance, date décès\nMÈRE, 01 ANIMAL, 0N> [mère] ANIMAL\n\nPEUT COHABITER AVEC, 0N ESPÈCE, 0N [commensale] ESPÈCE: nb. max. commensaux\nPÈRE, 0N> ANIMAL, 0N> [père présumé] ANIMAL\nXT,&&> ANIMAL, && A POIL, && A PLUME\n\n:\nA POIL: &grrr\n:\nA PLUME:&cuicui";
//document.getElementById("text").value  = ":\n:\nPÉRIODE: date début, _date fin\n\nPEUT VIVRE DANS, 1N ESPÈCE, 1N ENCLOS: nb. max. congénères\nENCLOS: num. enclos\nOCCUPE, 1N> ANIMAL, 1N> PÉRIODE, 1N ENCLOS\n\nESPÈCE: code espèce, libellé\nDF, 0N ESPÈCE, _11 ANIMAL\nANIMAL: nom, sexe, date naissance, date décès\nA MÈRE, 01 ANIMAL, 0N> [mère] ANIMAL\n\nPEUT COHABITER AVEC, 0N ESPÈCE, 0N [commensale] ESPÈCE: nb. max. commensaux\n:\nA PÈRE, 0N ANIMAL, 0N> [père présumé] ANIMAL";
//document.getElementById("text").value = "DF, 11 Élève, 1N Classe\nClasse: Num. classe, Num. salle\nFaire Cours, 1N Classe, 1N Prof: Vol. horaire\nCatégorie: Code catégorie, Nom catégorie\n\nÉlève: Num. élève, Nom élève\nNoter, 1N Élève, 0N Prof, 0N Matière, 1N Date: Note\nProf: Num. prof, Nom prof\nRelever, 0N Catégorie, 11 Prof\n\nDate: Date\nMatière: Libellé matière\nEnseigner, 11 Prof, 1N Matière";
document.getElementById("text").value = "EssenceBois: id, libelle\n:\n:\nConstituer, 0N EssenceBois, 11 MatierePremiere\n\n:\nComposant: id, libelle, longueur, largeur, epaisseur\nDecouper, 1N Composant, ON MatierePremiere: quantiteDecoupee, longueurPerte, longueurChute\nMatierePremiere:id, libelle, longueur, largeur, epaisseur, idEssence\nStock,0N MatierePremiere, 0N Site : stockActuel, stockAlerte\nSite: code, nom\n\ndans une, 0N EssenceBois, 11 ModelePalette\ncomposer, 0N Composant, 0N ModelePalette: Qantite\nLigneCommande,0N ModelePalette, 0N Commande: quantiteCommandee, prixUnitaireFacture, estFabrique\n:\nassocier, 11 Client, 0N Site\ntravailler, 0N Site, 11 Utilisateur\n\n: \nModelePalette: id, designation, longueur, largeur, poidsCharge, coutRevient, type, nomFichierPdf\nCommande: id, dateCommande, dateLivraisonPrevue, dateLivraisonReelle\npasser, 11 Commande, 0N Client\nClient:numero, raisonSociale, adresseRue, codePostal, ville, telephone, courriel, imageLogo\nUtilisateur: login, motDePasse, nom, prenom\n\n:\nXT, &&> ModelePalette, && Standard, && Personalisee\n:\ndemander, 11 Personalisee, 0N Client\n\nStandard: &refCatalogue\n:\nPersonalisee: &dateApplication, dateCreation, contact";
document.getElementById("title").value = "AHM-23";
var mcd =[];
var lien =[];
var out_svg ="";
function process() {
	mcd =[];	lien =[];	calque_texte="";calque_forme ="";calque_lien ="";
	var in_data = document.getElementById("text").value;
	document.getElementById("diagramOutput").innerHTML="";
	var in_lines = in_data.split("\n"), in_line="", in_elts =[], in_tmp =[];
	var i = 0, j=0,out_row = 0,out_col = 0,out_prop = new Array,out_card = [],out_error ="",out_name ="",out_type ="",nb_shape = 0;
	// charger la trame du svg
	if(fontLoaded == true && colorLoaded == true) {
		out_svg ="";
		var frame_test ="";
		var test_svg ='<svg id="svg_canvas" version="1.1" xmlns="http://www.w3.org/2000/svg"  width="864" height="360" viewBox="0 0 864 360">\n' +
		'<style type="text/css">\n'+svg_style+'\n</style>\n'+
		 '<g id="frame_test">\n' +
		'<text  id="lien_text" class="lien_text" x="30" y="30">N,N</text>' +
		 '<text id="asso_text"class="asso_text" x="30" y="60">([È§E,jgf|_µNAZ</text>' +
		 '<text id="ent_text"class="ent_text" x="30" y="90">([È§E,jgf|_µNAZ</text>' +
		 '<text  id="soul_text" class="ent_text" x="30" y="120"></text>' +
		'</g></svg>\n';
		document.getElementById("diagramOutput").innerHTML = test_svg;
		asso_haut_txt = rnd3(document.getElementById("asso_text").getBBox().height);
		ent_haut_txt  = rnd3(document.getElementById("ent_text").getBBox().height);
		lienHautTxt = rnd3(document.getElementById("lien_text").getBBox().height);
		lienLongTxt = rnd3(document.getElementById("lien_text").getBBox().width);
	}
// Analyse des données en entrée ( Boucle for)
	for (in_line of in_lines) {
		out_type = "";
		out_prop = new Array;
		out_card = [];
		in_line=in_line.trim();
		in_line=in_line.replace(/\s{2,}/g, ' ');
		if(in_line == "") {
			out_row++; out_col=0;
		} else if( in_line == ":") {
			out_col++;
		} else {
			in_elts = in_line.split(",");
			if(in_elts[0].indexOf(":")>0) {
				in_tmp = in_elts.shift().split(":");
				out_type = "Entity";
				out_name = in_tmp.shift();
				out_prop[0] = in_tmp.join(":");
				out_prop = out_prop.concat(in_elts);
			} else {
				in_tmp = in_line.split(":");
				in_elts = in_tmp.shift().split(",");
				if(in_elts.length > 0) {
					out_type = "Relation";
					out_name = in_elts.shift();
					out_card = in_elts;
					out_prop = in_tmp.join(":").split(",");
				}
			}
			if(out_type != null) {
				if(out_card != null) for (i==0; i<out_card.length; i++) out_card[i]=out_card[i].trim();
				if(out_prop != null) for (i==0; i<out_prop.length; i++) out_prop[i]=out_prop[i].trim();
				if(out_prop[0] == "") out_prop = new Array;
				mcd[nb_shape] = new MCDShape(out_name,out_type,out_row,out_col,out_prop,out_card);
				nb_shape++;
				out_col++;
			}
		}
	}
	// taille des elements de texte => taille des boites
	frame_test = document.getElementById("frame_test"); 
	frame_test.innerHTML += calque_texte;
	document.getElementById("svg_canvas").outerHTML = document.getElementById("svg_canvas").outerHTML;
	var liste_textes = frame_test.getElementsByTagName("g");
	i = liste_textes.length;
	min_box_haut = rnd3((asso_haut_txt +ligne_skip*2+box_stroke)*2+box_sep);
	while ( i-- ) {
		var tmp_elm = liste_textes[i].id.split("_");
		var bbox_elm = document.getElementById(liste_textes[i].id).getBBox();
		mcd[i].sDim = rnd3([bbox_elm.width+(elt_marg_gd+ box_stroke)*2,bbox_elm.height+ligne_skip*4 + box_sep]);
		if(mcd[i].sDim[1]<min_box_haut && mcd[i].sType == "Relation" && tmp_elm[0] != "DF" && tmp_elm[0] != "XT" && tmp_elm[0] != "T" && tmp_elm[0] != "X"&& tmp_elm[0] != "") mcd[i].sDim[1]= min_box_haut;
		nb_col=Math.max(mcd[i].sCol,nb_col);
		nb_row=Math.max(mcd[i].sRow,nb_row);
	}
	// dimensions des lignes et des colonnes
	var dim_col = new Array;
	var dim_row = new Array;
	for(i=0;i<=nb_col; i++) dim_col[i]=0;
	for(i=0;i<=nb_row; i++) dim_row[i]=0;
	i = liste_textes.length;
	while ( i-- ) {
		dim_col[mcd[i].sCol]=Math.max(mcd[i].sDim[0],dim_col[mcd[i].sCol]);
		dim_row[mcd[i].sRow]=Math.max(mcd[i].sDim[1],dim_row[mcd[i].sRow]);
	}
	//dimension de l'image de sortie := max(hauteur colone) * max(longueur ligne)
	var inter_col = lienLongTxt + elt_marg_gd*2.5;
	var inter_row = lienHautTxt + elt_marg_hb*3;
	var svg_long = rnd3(dim_col.reduce((total, valeur) => total + valeur, 0) + nb_col*inter_col + margin_size*2);
	var svg_haut = rnd3(dim_row.reduce((total, valeur) => total + valeur, 0) + nb_row*inter_row + margin_size*2);
	// calcul des coordonnées des lignes et des colonnes :
	var coord_col = new Array;
	var coord_row = new Array;
	for(i=0;i<=nb_col; i++) {
		coord_col[i]=margin_size;
		for (j=0; j<i; j++) coord_col[i]+=dim_col[j]+inter_col;
		coord_col[i]=rnd3(coord_col[i]);
	}
	for(i=0;i<=nb_row; i++) {
		coord_row[i]=margin_size;
		for (j=0; j<i; j++) coord_row[i]+=dim_row[j]+inter_row;
		coord_row[i]=rnd3(coord_row[i]);
	}
	 // calcul les coordonnées, les centres des boites; centre les titres :
	for (i in mcd) {
		mcd[i].sMid[0]=rnd3(coord_col[mcd[i].sCol]+(dim_col[mcd[i].sCol])/2);
		mcd[i].sMid[1]=rnd3(coord_row[mcd[i].sRow]+(dim_row[mcd[i].sRow])/2);
		mcd[i].sCoord[0]=rnd3(mcd[i].sMid[0]-(mcd[i].sDim[0])/2);
		mcd[i].sCoord[1]=rnd3(mcd[i].sMid[1]-(mcd[i].sDim[1])/2);
		if (mcd[i].sName != "DF" && mcd[i].sName != "XT"  && mcd[i].sName != "T" && mcd[i].sName != "X" && mcd[i].sName != "") {
			var delta_titre = mcd[i].sDim[0]- (document.getElementById(mcd[i].sName).getBBox().width+(elt_marg_gd+ box_stroke)*2);
			if (delta_titre>1) {
				var reg_exp = new RegExp('<text id="'+mcd[i].sName+'" x="0"','gm');
				calque_texte = calque_texte.replace(reg_exp, '<text id="'+mcd[i].sName+'" x="'+rnd3(delta_titre/2)+'"');
			}
		}
	}
	// génére les liaisons:
	for (i in mcd) {
		if (mcd[i].sType == "Relation") {
			var nb_lien = 0;
			var tmp_lien = new Array;
			for(j in mcd[i].sCard) {
				var tmp_txt = mcd[i].sCard[j].replace(/ \[.*?\]/g, "");
				tmp_lien = tmp_txt.trim().split(" ");
				tmp_txt = tmp_lien.shift();
				tmp_lien =  tmp_lien.join(" ");
				var qt_lien = mcd[i].sCard.toString().match(RegExp(tmp_lien,'gm')).length;
				lien[nb_lien] = new MCDLien(tmp_txt, tmp_lien, i, qt_lien);
				nb_lien ++;
			}
		}
	}
	// Ecriture du svg
	out_svg ='<svg id="svg_canvas" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+svg_long+'" height="'+svg_haut+
		'" viewBox="0 0 '+svg_long+' '+svg_haut+'">\n' +
		'<style type="text/css">\n'+svg_style+'\n</style>\n'+
		 '<rect id="frame" x="0" y="0" width="'+svg_long+'" height="'+svg_haut+'"/>\n';
	out_svg += '<defs><g id="fleche">\n<path class="lien_arrow" d="M 0 0 L -14 6 L -8 0 L -14 -6 Z" />\n</g></defs>\n';
	// Ecriture du calque des liens
	out_svg += '<g id="frame_lien">\n'+calque_lien+'</g>\n';
	// Ecriture du calque des boites
	out_svg += '<g id="frame_box">\n';
	for (i in mcd) {
		if (mcd[i].sType == "Entity") {
			var haut_top = rnd3(ligne_skip*2 + box_stroke + ent_haut_txt);
			var y_bot = rnd3(haut_top + mcd[i].sCoord[1]);
			out_svg += '<rect class="ent_top" x="'+mcd[i].sCoord[0]+'" y="'+mcd[i].sCoord[1]+'" width="'+mcd[i].sDim[0]+'" height="'+haut_top+'"/>\n';
			out_svg += '<rect class="ent_bot" x="'+mcd[i].sCoord[0]+'" y="'+y_bot+'" width="'+mcd[i].sDim[0]+'" height="'+rnd3(mcd[i].sDim[1]-haut_top)+'"/>\n';
			out_svg += '<rect class="ent_bord" x="'+mcd[i].sCoord[0]+'" y="'+mcd[i].sCoord[1]+'" width="'+mcd[i].sDim[0]+'" height="'+mcd[i].sDim[1]+'"/>\n';
			out_svg += '<line class="ent_sep" x1="'+mcd[i].sCoord[0]+'" y1="'+y_bot+'" x2="'+rnd3(mcd[i].sCoord[0]+mcd[i].sDim[0])+'" y2="'+y_bot+'"/>\n';
		} else if (mcd[i].sType == "Relation" && mcd[i].sName != "DF" && mcd[i].sName != "XT" && mcd[i].sName != "T" && mcd[i].sName != "X" && mcd[i].sName != "") {
			var haut_top = rnd3(ligne_skip*2 + box_stroke + asso_haut_txt);
			var y_bot = rnd3(haut_top + mcd[i].sCoord[1]);
			var asso_path ='<path class="asso_top" d="M #xtop #ytop a #radius #radius 90 0 1 #radius #radius v #delta_yt_top h -#lg_box v -#delta_yt_top a #radius #radius 90 0 1 #radius -#radius"/>\n'+
				'<path class="asso_bot" d="M #xbot #ybot a #radius #radius 90 0 1 -#radius -#radius v -#delta_yb h #lg_box v #delta_yt_bot a #radius #radius 90 0 1 -#radius #radius"/>\n'
			asso_path=asso_path.replace(/#radius/gm, asso_radius); asso_path=asso_path.replace(/#xtop/gm, rnd3(mcd[i].sCoord[0]+mcd[i].sDim[0]-asso_radius));
			asso_path=asso_path.replace(/#ytop/gm, mcd[i].sCoord[1]);asso_path=asso_path.replace(/#lg_box/gm, mcd[i].sDim[0]);
			asso_path=asso_path.replace(/#delta_yt_top/gm, rnd3(haut_top-asso_radius));asso_path=asso_path.replace(/#xbot/gm, rnd3(mcd[i].sCoord[0]+asso_radius));
			asso_path=asso_path.replace(/#ybot/gm, rnd3(mcd[i].sCoord[1]+mcd[i].sDim[1]));asso_path=asso_path.replace(/#delta_yb/gm, rnd3(mcd[i].sDim[1]-haut_top-asso_radius));
			asso_path=asso_path.replace(/#delta_yt_bot/gm, rnd3(mcd[i].sDim[1]-haut_top-asso_radius));out_svg += asso_path;
			out_svg += '<rect class="asso_bord" x="'+mcd[i].sCoord[0]+'" y="'+mcd[i].sCoord[1]+'" width="'+mcd[i].sDim[0]+'" height="'+mcd[i].sDim[1]+'" rx="'+asso_radius+'"/>\n';
			out_svg += '<line class="asso_sep" x1="'+mcd[i].sCoord[0]+'" y1="'+y_bot+'" x2="'+rnd3(mcd[i].sCoord[0]+mcd[i].sDim[0])+'" y2="'+y_bot+'"/>\n';
		} else if (mcd[i].sType == "Relation" && mcd[i].sName == "DF") {
			 out_svg +='<circle class="asso_df" cx="'+mcd[i].sMid[0]+'" cy="'+rnd3(mcd[i].sMid[1]+ligne_skip/2)+'" r="'+rnd3(lienHautTxt/2+elt_marg_hb+ligne_skip/2)+'"/>\n';
		} else if (mcd[i].sType == "Relation" && (mcd[i].sName == "XT" || mcd[i].sName != "T" || mcd[i].sName != "X"|| mcd[i].sName != "")) {
			 out_svg +='<polygon class="asso_df" points="'+mcd[i].sMid[0]+','+rnd3(mcd[i].sCoord[1]-elt_marg_hb)+' '+rnd3(mcd[i].sCoord[0]-elt_marg_gd)+','+rnd3(mcd[i].sCoord[1]+mcd[i].sDim[1])+' '+rnd3(mcd[i].sCoord[0]+mcd[i].sDim[0]+elt_marg_gd)+','+rnd3(mcd[i].sCoord[1]+mcd[i].sDim[1])+'"/>\n';
		}
	}
	out_svg += '</g>\n';
	// Ecriture du calque des textes
	out_svg += '<g id="frame_text">\n';
	for (i in mcd) {
		out_svg += '<g class="';
		out_svg += (mcd[i].sType =="Relation")  ? 'asso_text">\n' : 'ent_text">\n';
		for(j in mcd[i].sShapeTexte) {
			tmp_txt=mcd[i].sShapeTexte[j][0];
			tmp_txt=tmp_txt.replace(/#coord_x/g, rnd3(mcd[i].sShapeTexte[j][1][0]+mcd[i].sCoord[0]+elt_marg_gd+box_stroke));
			tmp_txt=tmp_txt.replace(/#coord_y/g, rnd3(mcd[i].sShapeTexte[j][1][1]+mcd[i].sCoord[1]+ligne_skip));
			out_svg += tmp_txt+'\n';
		}
		out_svg += '</g>\n';
	}
	out_svg += '</g>\n</svg>\n';
	var test_coord = new Array;
	for (i in mcd) test_coord[i]=mcd[i].sDim;
	// affichage du resultat
	document.getElementById("diagramOutput").innerHTML = out_svg;
	var txt_tmp =document.getElementById("diagramOutput").getAttribute("class").replace(" initial","");
	document.getElementById("diagramOutput").setAttribute("class", txt_tmp);
	document.getElementById("downloadButton").style.display = "block";
} // fin de function process() (génération)
class MCDLien {
	constructor (_LCard, _Vers, _iDepuis, _QtLie) {
		this.lCard = _LCard; this.lRang = 0;
		var iVers = mcd.findIndex(elm =>elm.sName == _Vers);
		if(_QtLie == 2) if (lien.some(elm => (elm.lVers == iVers && elm.lDepuis == _iDepuis))) this.lRang = 2; else this.lRang = 1;
		this.lVers = iVers;	this.lDepuis = _iDepuis; this.lQtLie = _QtLie;
		calque_lien += drawLi(_iDepuis,iVers,_LCard,this.lRang,elt_marg_gd+box_stroke,elt_marg_hb+box_stroke);
	}
}
function drawLi(i,j,card,rang,mX,mY) {
	var svg_lien ="",soul="",flch="",cF = [[null,null],null,null],P0=[null,null],P1=[null,null],P2=[null,null],tmp=[null,null],cL=[null,null],iI=[null,null],iJ=[null,null],
	Pm=[[null,null],[null,null]], interI=[[null,null],[null,null]],interJ=[[null,null],[null,null]];
	var crd=Array.from(card);if(card.endsWith(">")) flch=crd.pop();if(crd[0]=="_"||crd[0]=="-")soul = crd.shift();
	var dC= mcd[j].sCol-mcd[i].sCol, dR = mcd[j].sRow - mcd[i].sRow, dist = Math.abs(dC) + Math.abs(dR);
	
	var equaL = droiteAB(mcd[i].sMid,mcd[j].sMid), angle = angleAB(mcd[j].sMid,mcd[i].sMid);
	if(rang == 0) {
		svg_lien += '<line class="lien_droit " x1="'+mcd[i].sMid[0]+'" y1="'+mcd[i].sMid[1]+'" x2="'+mcd[j].sMid[0]+'" y2="'+mcd[j].sMid[1]+'"/>\n';
		cF[1] = (equaL[0]==null) ? 90 : Math.round(Math.atan(equaL[0])*180/Math.PI);  if (dC<0) cF[1] += 180; if(cF[1]<=0) cF[1]+=360;
		interJ = intersecRect(equaL,[mcd[j].sCoord,[mcd[j].sCoord[0]+mcd[j].sDim[0],mcd[j].sCoord[1]+mcd[j].sDim[1]]]);
		interI = intersecRect(equaL,[mcd[i].sCoord,[mcd[i].sCoord[0]+mcd[i].sDim[0],mcd[i].sCoord[1]+mcd[i].sDim[1]]]);
		iI= (distanceAB(mcd[j].sMid,interI[1]) > distanceAB(mcd[j].sMid,interI[0])) ? interI[0] : interI[1];
		iJ= (distanceAB(mcd[i].sMid,interJ[1]) > distanceAB(mcd[i].sMid,interJ[0])) ? interJ[0] : interJ[1];
		cF[0] =rnd3(iJ);
		cL=rnd3([iJ[0]-(iJ[0]-iI[0])*0.333,iJ[1]-(iJ[1]-iI[1])*0.333]);
		cL=rnd3(cL);
		if (/>/.test(flch)) svg_lien += '<use xlink:href="#fleche" x="'+cF[0][0] +'" y="'+cF[0][1] +'" transform="rotate( '+cF[1] +' '+cF[0][0] +' '+cF[0][1] +')" />\n';
	} else {
		if (rang ==2) {	dC *= -1; dR *= -1;}
		if (Math.abs(equaL[0]) !=Infinity) equaL[1] -= (dC/Math.abs(dC))*(Math.min(mcd[i].sDim[0],mcd[i].sDim[1],mcd[j].sDim[0],mcd[j].sDim[1])/2-dist*mX);
		else equaL[2] -= (dR/Math.abs(dR))*(Math.min(mcd[i].sDim[0],mcd[i].sDim[1],mcd[j].sDim[0],mcd[j].sDim[1])/2-dist*.667*mY);
		interI = intersecRect(equaL,[mcd[i].sCoord,[mcd[i].sCoord[0]+mcd[i].sDim[0],mcd[i].sCoord[1]+mcd[i].sDim[1]]]);
		interJ = intersecRect(equaL,[mcd[j].sCoord,[mcd[j].sCoord[0]+mcd[j].sDim[0],mcd[j].sCoord[1]+mcd[j].sDim[1]]]);
		P0= rnd3((distanceAB(mcd[j].sMid,interI[0]) < distanceAB(mcd[j].sMid,interI[1])) ? interI[0] : interI[1]);
		P2= rnd3((distanceAB(mcd[i].sMid,interJ[0]) < distanceAB(mcd[i].sMid,interJ[1])) ? interJ[0] : interJ[1]);
		Pm= bezier2P1(P0,P2,mX*dist); cF[0]=P2;
		P1= ((rang==2 && angle>180)||(rang==1 && angle<=180)) ? Pm[1] : Pm[0];
		cL=[bezier2(P0[0],P1[0],P2[0],0.667),bezier2(P0[1],P1[1],P2[1],0.667)];
		P0=rnd3([bezier2(P0[0],P1[0],P2[0],-0.1),bezier2(P0[1],P1[1],P2[1],-0.1)]);
		cF[1]=Math.round(angleAB([bezier2(P0[0],P1[0],P2[0],1-10/distanceAB(P0,P2)),bezier2(P0[1],P1[1],P2[1],1-10/distanceAB(P0,P2))],P2));
		svg_lien += '<path class="lien_curv" d="M '+P0[0]+' '+P0[1]+' Q '+P1[0]+' '+P1[1]+' '+P2[0]+' '+P2[1]+ '" />\n';
		if (/</.test(flch) || />/.test(flch)) svg_lien += '<use xlink:href="#fleche" x="'+rnd3(cF[0][0])+'" y="'+rnd3(cF[0][1])+'" transform="rotate( '+Math.round(cF[1])+' '+rnd3(cF[0][0])+' '+rnd3(cF[0][1])+')" />\n';
	}
	card=card.trim();
	soul = "";
	if (/^_/.test(card)) {soul ="_"; card=card.replace(/^_/,"");
	} else if (/^-/.test(card)) {soul ="-"; card=card.replace(/^-/,"")}
	if (dR == 0) cL[1] -= mY/2; else if (dC==0) cL[0] += mX/2;
	if(rang ==0)	if((dC==0 && dR<0)||(dC<0 && dR>0)||(dC>0 && dR<0)) cL[1]+=lienHautTxt;
	if(rang ==1)	if((dC==0 && dR<0)||(dC<0 && dR>0)||(dC>0 && dR<0)) cL[1]+=lienHautTxt*0.75;
	if(rang ==2)	if((dC==0 && dR>0)||(dC<0 && dR>0)||(dC>0 && dR<0)) cL[1]+=lienHautTxt*0.75;
	if(rang>0 && dR==0) cL[0] -= lienLongTxt/2.5;
	if(rang==0 && dC>0 && dR==0) cL[0] -= lienLongTxt/2;
	if((rang==2&&dC>0&&dR<0)||(rang==1&&dC<0&&dR>0)) cL[1]-=lienHautTxt*1.75;
	if(rang==2&&dC>0&&dR==0) cL[1]+=lienHautTxt*1.33;
	cL=rnd3(cL);
	if(crd[0]!="&") svg_lien += (soul == "") ? '<text class="lien_text" x="'+ cL[0] +'" y="'+ cL[1] +'">'+crd+'</text>\n' : '<text class="lien_text" text-decoration="underline" x="'+ cL[0] +'" y="'+ cL[1] +'">'+crd+'</text>\n'
	return svg_lien;
}
class MCDShape {
	constructor (_Name, _Type, _Row, _Col, _Prop,_Card) {
		this.sName = _Name; this.sType = _Type; this.sRow = _Row; this.sCol = _Col; this.sProp = _Prop;	this.sCard = _Card;	this.sDim = [0,0]; this.sMid = [0,0];
		this.sCoord = [0,0];	this.sShapeTexte = new Array;
		var titre_haut = 0, titre_long = 0, donnee_haut = 0, donne_long = 0, i = 0;
		var souligne ="", y=0, tmp_txt="";
		tmp_txt = '<g id="'+_Name+'_T_' + _Row+'_'+_Col+'" class="';
		tmp_txt += (_Type =="Relation")  ? 'asso_text" ' : 'ent_text"';
		y = (_Type =="Relation")  ? asso_haut_txt : ent_haut_txt;
		tmp_txt += '>\n<text id="'+_Name+'" x="0" y="'+y+'">'+_Name+'</text>';
		this.sShapeTexte[0]= ['<text x="#coord_x" y="#coord_y" >'+_Name+'</text>',[0,y],""];
		y += (_Type =="Relation")  ? asso_haut_txt : ent_haut_txt;
		y += (ligne_skip*2 + box_sep);
		for (i in _Prop) {
			_Prop[i]=_Prop[i].trim();
			souligne = "";
			if(/^_/.test(_Prop[i]) || (i==0 && !/^&/.test(_Prop[i]) && _Type=="Entity")) {souligne ="_"; _Prop[i]=_Prop[i].replace(/^_/,"")
			} else if (/^-/.test(_Prop[i])) {souligne ="-"; _Prop[i]=_Prop[i].replace(/^-/,"")}
			if (i==0) _Prop[i]=_Prop[i].replace(/^&/,"");
			tmp_txt += (souligne == "") ? '\n<text x="0" y="'+ y +'">'+_Prop[i]+'</text>' : '\n<text text-decoration="underline" x="0" y="'+ y +'">'+_Prop[i]+'</text>';
			this.sShapeTexte[i+1]=  (souligne == "") ? ['<text x="#coord_x" y="#coord_y" >'+_Prop[i]+'</text>',[0,y]]:['<text text-decoration="underline" x="#coord_x" y="#coord_y" >'+_Prop[i]+'</text>',[0,y]];
			y += (_Type =="Relation")  ? asso_haut_txt : ent_haut_txt;
			y = rnd3(y);
		}
		tmp_txt += '\n</g>\n'; 
		calque_texte += tmp_txt;
	}
}
function bezier2(p0,p1,p2,t) {return p0*((1-t)**2)+p1*2*t*(1-t)+p2*(t**2);}
function bezier2Deriv(p0,p1,p2,t) {return (2*(1-t)*(p0-p1)+2*t*(p2-p1));}
function distanceAB(A,B) {return Math.sqrt((A[0]-B[0])**2+(A[1]-B[1])**2)}
function bezier2P1(P0,P2,d) {
	let D=droiteAB(P0,P2),a=0,M=[(P0[0]+P2[0])/2,(P0[1]+P2[1])/2],t=0,S = [[null,null],[null,null]];
	if (Math.abs(D[0]) == Infinity) S=[[M[0]-d,M[1]],[M[0]+d,M[1]]]
	else if (Math.abs(D[0]) == 0) S=[[M[0],M[1]+d],[M[0],M[1]-d]]
	else {a=(-1/D[0]); t=Math.sqrt(d**2/(1+a**2));S=[[M[0]+t,M[1]+a*t],[M[0]-t,M[1]-a*t]]}
	return S}
function intersecDD(a,b,c,d) { let sol = [null,null,null], D1 = droiteAB(a,b), D2 = droiteAB(c,d); sol[0] = (D1[1]-D2[1])/(D1[0]-D2[0]);
	sol[1] = D1[0]*sol[0]+D1[1]; sol[2] = D1[0]; return sol;}
function intersecRect(D,R) {let sol = [[null,null],[null,null]], s=0,t=0;
	if (Math.abs(D[0]) ==Infinity) {if (D[2]<Math.max(R[0][0],R[1][0]) && D[2]>Math.min(R[0][0],R[1][0])) {sol[0]=[D[2],R[0][1]];sol[1]=[D[2],R[1][1]];}
	} else if (D[0] ==0) {if (D[1]<Math.max(R[0][1],R[1][1]) && D[1]>Math.min(R[0][1],R[1][1] )) {sol[0]=[R[0][0],D[1]];sol[1]=[R[1][0],D[1]]}
	} else {t=(R[0][1]-D[1])/D[0];if (t>Math.min(R[0][0],R[1][0]) && t<Math.max(R[0][0],R[1][0])) {sol[s]=[t,R[0][1]];s++}
		t=(R[1][1]-D[1])/D[0];if (t>Math.min(R[0][0],R[1][0]) && t<Math.max(R[0][0],R[1][0])) {sol[s]=[t,R[1][1]];s++}
		t=(D[0]*R[0][0])+D[1];if (s<2&&t>Math.min(R[0][1],R[1][1]) && t<Math.max(R[0][1],R[1][1])) {sol[s]=[R[0][0],t];s++}
		t=(D[0]*R[1][0])+D[1];if (s<2&&t>Math.min(R[0][1],R[1][1]) && t<Math.max(R[0][1],R[1][1])) {sol[s]=[R[1][0],t]}
	} return sol;
}
function textExtBox(R,A,h,l) {let sol = [[null,null],[null,null]];
	if (Math.abs(D[0]) ==Infinity) {if (D[2]<Math.max(R[0],R[2]) && D[2]>Math.min(R[0],R[2])) {sol[0]=D[2];sol[2]=D[2];sol[1]=R[1];sol[3]=R[3];}
	} else if (D[0] ==0) {if (D[1]<Math.max(R[1],R[3]) && D[1]>Math.min(R[1],R[3] )) {sol[1]=D[1];sol[3]=D[1];sol[0]=R[0];sol[2]=R[2];}
	} else if ((R[1]-D[1])/D[0]>Math.min(R[0],R[2]) && (R[1]-D[1])/D[0]<Math.max(R[0],R[2])) {sol[1]=R[1];sol[3]=R[3];sol[0]=(R[1]-D[1])/D[0];sol[2]=(R[3]-D[1])/D[0];
	} else if ((D[0]*R[0])+D[1]>Math.min(R[1],R[3]) && (D[0]*R[0])+D[1]<Math.max(R[1],R[3])) {sol[0]=R[0];sol[2]=R[2];sol[1]=(D[0]*R[0])+D[1];sol[3]=(D[0]*R[2])+D[1];
	} return sol;
}
function droiteAB(A,B) {let sol = [null,null,null];sol[0] = (B[1]-A[1])/(B[0]-A[0]);sol[1]= A[1]-sol[0]*A[0];if (Math.abs(sol[0])==Infinity) sol[2]=A[0];return (sol);}
function angleAB(A,B) {let a=null,dx=B[0]-A[0],dy=B[1]-A[1];if(dx==0) a= (dy>0) ? a=90 : a=270;else a=Math.atan(dy/dx)*180/Math.PI;if (dx>0 && dy<0) a+=360;else if (dx<0.) a+=180.;if(a<=0) a+=360;return (a);}
function equa2nD(A,B,C) {let sol=[null,null];let delta=(B**2)-4*A*C;if(delta== 0) sol[0]=-B/(2*A);else if(delta > 0){sol[0]=(-B +Math.sqrt(delta))/(2*A);sol[1]=(-B -Math.sqrt(delta))/(2*A);} return (sol);}
function rnd3(calc) {let i;if(typeof calc == "object") for(i in calc) calc[i]=rnd3(calc[i]); else calc=Math.round(calc*1000)/1000;	return (calc)} 
