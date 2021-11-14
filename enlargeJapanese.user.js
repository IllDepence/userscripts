// ==UserScript==
// @name          enlargeJapanese
// @namespace     enlargeJapanese
// @description   enlarge Japanese text
// @include       *
// ==/UserScript==

var minFontSize = 16;
var minFontSizeFurigana = minFontSize/2;
var jPatt = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\u3400-\u4dbf]+/g;

/*
 * http://salaciak.blogspot.de/2011/02/javascript-dom-how-to-get-elements.html
 */
function elementCurrentStyle(element, styleName){
    if (element.currentStyle) {
        var i = 0, temp = "", changeCase = false;
        for (i = 0; i < styleName.length; i++) {
            if (styleName[i] != '-') {
                temp += (changeCase ? styleName[i].toUpperCase() : styleName[i]);
                changeCase = false;
            } else {
                changeCase = true;
            }
        styleName = temp;
        return element.currentStyle[styleName];
        }
    } else {
        return getComputedStyle(element, null).getPropertyValue(styleName);
    }
}

/*
 * sirtetris
 */

function getEnlarged(text, fontSize) {
        return text.replace(jPatt, '<span style="font-size:'+fontSize+'px !important;">$&</span>');
    }

function enlargeOnlyInnerMost(elem, fontSize) {
    if(elem.nodeName == "TEXTAREA") return;
    if(elem.hasChildNodes()) {
        var cn = elem.childNodes;
        for(var i=0; i<cn.length; i++) {
            enlargeOnlyInnerMost(cn[i]);
            }
        }
    else {
        // at this point elem is a text node or an empty element
        if(elem.textContent.length <= 1 && elem.nodeType == 1) {
            // an empty element
            if(elem.hasAttribute('value')) {
                if(elem.value.search(jPatt) > -1) {
                    elem.style.fontSize = minFontSize+'px';
                    }
                }
            return;
            }
        if(elem.nodeType == 3) {
            // a text node
            var parent = elem.parentNode;
            var setFontSize = minFontSize;
            if (parent.tagName == 'RT') {
                if(elementCurrentStyle(parent, "font-size").replace("px","") >= minFontSizeFurigana) {
                    return;
                }
                setFontSize = minFontSizeFurigana;
            }
            else {
                if(elementCurrentStyle(parent, "font-size").replace("px","") >= minFontSize) {
                    return;
                }
            }
            if(parent.childNodes.length == 1) {
                // a node with only text in it. it's save to just insert < and >
                parent.innerHTML = getEnlarged(parent.innerHTML, setFontSize);
                }
            else {
                // node with tags in it. be sure to not insert < and > inside of them
                var toDo = (elem.nodeValue.match(jPatt) || Array());
                for(var j=0; i<toDo.length; j++) {
                    parent.innerHTML = parent.innerHTML.replace(toDo[i], '<span style="font-size:'+setFontSize+'px !important;">'+toDo[i]+'</span>');
                    }
                }
            }
        }
    }

enlargeOnlyInnerMost(document.body);
