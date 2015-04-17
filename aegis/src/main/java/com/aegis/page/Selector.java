/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aegis.page;

import org.stjs.javascript.dom.Element;

/**
 *
 * @author david
 */
public class Selector {
    private boolean isVisible(Element element){
        return false;
    }
}

/*
var compuestos=["div"];
function esVisible(elem){
	if(!(elem instanceof Element)){
		//Requisito: que la visibilidad del nodo padre sea verificada y sea true
		return true;
	}
	var style=getComputedStyle(elem);
	return !(style.display=="none" || style.visibility=="hidden" || style.position=="fixed");
//this disable also elements with position=fixed in chrome
	return elem.offsetParent != null;
//	return !(elem.offsetWidth === 0 && elem.offsetHeight === 0) ;
}
function esGrande(elem){
	return (elem.offsetWidth > 8 && elem.offsetHeight > 8);
}
function esUnitario(node){
	return esVisible(node) && (compuestos.indexOf(node.nodeName.toLowerCase())==-1);
}
function esVacio(node){
	return node.childNodes.length==0;
}
function esSimple(node){
	if(esUnitario(node)) return false;
	if(!esVisible(node)) return false;
	var cntSimple=0;
	var cntUnit=0;
	var cc=node.childNodes;
	for(var i=0,l=cc.length;i<l;i++) {
		if(esSimple(cc[i])) {
			cntSimple++;
		} else if(esUnitario(cc[i]) || esVacio(cc[i])) {
			cntUnit++;
		} else {
			//No es simple
			return false;
		}
	}
	return (cntSimple===1) || (cntSimple===0 && cntUnit>=1);
}
function whyEsSimple(node){
	if(esUnitario(node)) return false;
	if(!esVisible(node)) return false;
	var cntSimple=0;
	var cntUnit=0;
	var cc=node.childNodes;
	for(var i=0,l=cc.length;i<l;i++) {
		console.log(cc[i], "essimple:",esSimple(cc[i]), "esunitario:",esUnitario(cc[i]));
		if(esSimple(cc[i])) {
			cntSimple++;
		} else if(esUnitario(cc[i]) || esVacio(cc[i])) {
			cntUnit++;
		} else {
			console.log(node, "contiene un complejo");
			//No es simple
			return false;
		}
	}
	console.log(node, cntSimple, cntUnit);
	return (cntSimple===1) || (cntSimple===0 && cntUnit>=1);
}
function buscaNodos(node, comps){
	var cc=node.childNodes;
	for(var i=0,l=cc.length;i<l;i++) if(esVisible(cc[i])){
		if(esUnitario(cc[i]) || esSimple(cc[i])){
			if(typeof cc[i].style!="undefined"){
				if(esGrande(cc[i])) {
					//cc[i].style.outline="4px solid green";
					//cc[i].style.opacity="0.3";
					comps.push(cc[i]);
				} else {
					buscaNodos(cc[i], comps);
				}
			}
		} else if(!esSimple(cc[i])) {
			buscaNodos(cc[i], comps);
		}
	} else {
		console.log("hidden:", cc[i]);
	}
	return comps;
}
function moveDiv(aa, pp1){
	var pp=getOffset(pp1);
	aa.style.position="absolute";
	aa.style.left=pp.left+"px";
	aa.style.top=pp.top+"px";
	aa.style.width=pp1.clientWidth+"px";
	aa.style.height=pp1.clientHeight+"px";
	//aa.style.border="4px solid red";
	aa.style.boxShadow="0px 0px 0px 4px blue inset";
	aa.style.zIndex="10000";
	//aa.style.boxShadow="0px 0px 0px 1000px rgba(0,0,0,0.02)";
	aa.style.backgroundColor="rgba(0,0,255,0.2)";
};
function marcar(pp1){
	var aa=document.createElement("span");
	document.body.appendChild(aa);
	moveDiv(aa, pp1);
}
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
aa=buscaNodos(document.body, []);
aa.forEach(function(a){marcar(a);});


*/
