window.AEGIS.Selector={
    composed:["div"],
    focusDiv:null,
    isVisible:function(elem){
	if(!(elem instanceof Element)){
		//Requisito: que la visibilidad del nodo padre sea verificada y sea true
		return true;
	}
        if(elem.className.indexOf("aegis-selector-mark")>=0) {
            return false;
        }
	var style=getComputedStyle(elem);
        if(!style) {
            //elements like script
            return false;
        }
	return !(style.display=="none" || style.visibility=="hidden" || style.position=="fixed");
    },
    isBigEnough:function(elem){
	return (elem.offsetWidth > 8 && elem.offsetHeight > 8);
    },
    isUnitary:function(node){
	return this.isVisible(node) && (this.composed.indexOf(node.nodeName.toLowerCase())==-1);
    },
    isEmpty:function(node){
	return node.childNodes.length==0;
    },
    isSelectable:function(node, noDebug){
        if(!noDebug){
            console.log( node, this.isUnitary(node) , this.isSimple(node) , this.isBigEnough(node) );
        }
        return (this.isUnitary(node) || this.isSimple(node)) && this.isBigEnough(node);
    },
    itsParentsAreSelectable:function(node){
        while(node instanceof Element && node!==document.body && node.parentNode!==document.body) {
            if(this.isSelectable(node.parentNode, true)) {
                console.log("parent:", node.parentNode);
                return node.parentNode;
            } else {
                return this.itsParentsAreSelectable(node.parentNode);
            }
        }
        return false;
    },
    isSimple:function(node){
	if(this.isUnitary(node)) return false;
	if(!this.isVisible(node)) return false;
	var cntSimple=0;
	var cntUnit=0;
	var cc=node.childNodes;
	for(var i=0,l=cc.length;i<l;i++) {
		if(this.isSimple(cc[i])) {
			cntSimple++;
		} else if(this.isUnitary(cc[i]) || this.isEmpty(cc[i])) {
			cntUnit++;
		} else {
			//No es simple
			return false;
		}
	}
	return (cntSimple===1) || (cntSimple===0 && cntUnit>=1);
    },
    findNodes:function(node, comps){
	var cc=node.childNodes;
	for(var i=0,l=cc.length;i<l;i++) if(this.isVisible(cc[i])){
		if(this.isUnitary(cc[i]) || this.isSimple(cc[i])){
			if(typeof cc[i].style!="undefined"){
				if(this.isBigEnough(cc[i])) {
					//cc[i].style.outline="4px solid green";
					//cc[i].style.opacity="0.3";
					comps.push(cc[i]);
				} else {
					this.findNodes(cc[i], comps);
				}
			}
		} else if(!this.isSimple(cc[i])) {
			this.findNodes(cc[i], comps);
		}
	} else {
		//console.log("hidden:", cc[i]);
	}
	return comps;
    },
    moveDiv:function(aa, pp1){
	var pp=this.getOffset(pp1);
	aa.style.position="absolute";
	aa.style.left=pp.left+"px";
	aa.style.top=pp.top+"px";
	aa.style.width=pp1.clientWidth+"px";
	aa.style.height=pp1.clientHeight+"px";
    },
    mark:function(pp1, selectionType){
	var aa=document.createElement("span");
        aa.className="aegis-selector-mark" + (
                    (typeof selectionType!=="undefined" && 
                    selectionType) ? (" aegis-selector-mark-"+selectionType) : ""
                );
	document.body.appendChild(aa);
	this.moveDiv(aa, pp1);
    },
    focus:function(pp1){
        if(!this.focusDiv){
            this.focusDiv=document.createElement("span");
            this.focusDiv.className="aegis-selector-mark aegis-selector-mark-focus";
            document.body.appendChild(this.focusDiv);
        }
        this.focusDiv.style.display="block";
	this.moveDiv(this.focusDiv, pp1);
    },
    hideFocus:function(pp1){
        if(this.focusDiv){
            this.focusDiv.style.display="hidden";
        }
    },
    getOffset:function( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    },
    clearMarks:function(){
        var marks=document.getElementsByClassName("aegis-selector-mark");
        this.focusDiv=null;
        while(marks.length>0){
            marks[0].remove();
        }
    }
};
