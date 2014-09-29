// ==UserScript==
// @name          lang-8-correction-enhance
// @namespace     lang-8-correction-enhance
// @description   giving crappy corrections on lang-8 some color
// @include       *//lang-8.com/*
// ==/UserScript==

/*
 *
 * DJ Mountney (2012)
 * https://github.com/paulgb/simplediff
 *
 */
var diff=function(before,after){var oldIndexMap={},i;for(i=0;i<before.length;i++){oldIndexMap[before[i]]=oldIndexMap[before[i]]||[];oldIndexMap[before[i]].push(i)}var overlap=[],startOld,startNew,subLength,inew;startOld=startNew=subLength=0;for(inew=0;inew<after.length;inew++){var _overlap=[];oldIndexMap[after[inew]]=oldIndexMap[after[inew]]||[];for(i=0;i<oldIndexMap[after[inew]].length;i++){var iold=oldIndexMap[after[inew]][i];_overlap[iold]=(iold&&overlap[iold-1]||0)+1;if(_overlap[iold]>subLength){subLength=_overlap[iold];startOld=iold-subLength+1;startNew=inew-subLength+1}}overlap=_overlap}if(subLength===0){var result=[];before.length&&result.push(["-",before]);after.length&&result.push(["+",after]);return result}return[].concat(diff(before.slice(0,startOld),after.slice(0,startNew)),[["=",after.slice(startNew,startNew+subLength)]],diff(before.slice(startOld+subLength),after.slice(startNew+subLength)))};var stringDiff=function(before,after){return diff(before.split(/[ ]+/),after.split(/[ ]+/))};var htmlDiff=function(before,after){var a,b,con,diff,i,results=[];con={"=":function(x){return x},"+":function(x){return"<ins>"+x+"</ins>"},"-":function(x){return"<del>"+x+"</del>"}};diff=stringDiff(before,after);for(i=0;i<diff.length;i++){var chunk=diff[i];results.push(con[chunk[0]](chunk[1].join(" ")))}return results.join(" ")};var checkDiff=function(before,after){before=[before];after=[after];var result=diff(before,after),_before=[],_after=[],i;for(i=0;i<result.length;i++){switch(result[i][0]){case"-":_before=_before.concat(result[i][1]);break;case"+":_after=_after.concat(result[i][1]);break;default:_before=_before.concat(result[i][1]);_after=_after.concat(result[i][1])}}console.assert(JSON.stringify(before)===JSON.stringify(_before),"Expected",before,"got",_before);console.assert(JSON.stringify(after)===JSON.stringify(_after),"Expected",after,"got",_after)};if(typeof module==="object"){module.exports={diff:diff,htmlDiff:htmlDiff,stringDiff:stringDiff,checkDiff:checkDiff}}

/*
 * sirtetris
 * WTFPL
 */
var correction_lists = document.querySelectorAll('div.correction_list');
var l8ce_arr = Array();
sessionStorage.setItem('l8ce_arr', JSON.stringify(l8ce_arr));
var id = 0;
for(var h=0; h<correction_lists.length; h++) {
    var corrections = correction_lists[h].querySelectorAll('ul.correction_field');
    for(var i=0; i<corrections.length; i++) {
        var wrongText = corrections[i].querySelector('li.incorrect').textContent;
        var rightNode = corrections[i].querySelector('li.corrected');
        if(rightNode.classList.contains('perfect')) {
            continue;
            }
        rightNode.id = 'l8ce_'+id;
        var rightText = rightNode.querySelector('p').textContent;
        var diffArr = diff(wrongText, rightText);
        var newText = '<p>';
        for(var j=0; j<diffArr.length; j++) {
            var chunk = diffArr[j];
            var chunkType = chunk[0];
            var chunkText = chunk[1];
            if(chunkType == '=') newText += '<span style="color: #00b">'+chunkText+'</span>';
            if(chunkType == '-') newText += '<span style="color: #ccc;text-decoration:line-through">'+chunkText+'</span>';
            if(chunkType == '+') newText += '<span style="color: #d00">'+chunkText+'</span>';
            }
        newText += '</p>';
        l8ce_arr = JSON.parse(sessionStorage.getItem('l8ce_arr'));
        l8ce_arr[id] = newText;
        sessionStorage.setItem('l8ce_arr', JSON.stringify(l8ce_arr));
        rightNode.style.cursor = 'pointer';
        rightNode.title = 'click to toggle enhancement';
        rightNode.onclick = function() {
                                var id = this.id.replace('l8ce_', '');
                                var l8ce_arr = JSON.parse(sessionStorage.getItem('l8ce_arr'));
                                var swapText = l8ce_arr[id];
                                l8ce_arr[id] = this.innerHTML;
                                sessionStorage.setItem('l8ce_arr', JSON.stringify(l8ce_arr));
                                this.innerHTML = swapText;
                                };
        id++;
        }
    }
