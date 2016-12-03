// ==UserScript==
// @name          2ch-keshou
// @namespace     2ch-keshou
// @description   make 2ch a bit less eye cancer inducing
// @include       *.2ch.net/*
// ==/UserScript==

var firstThreadLinks = document.querySelectorAll('a[href="#1"]');
var firstThreadLink  = firstThreadLinks[1];  // [0] is a link at the page top
var threadListCntr   = firstThreadLink.parentNode;
var threadList       = threadListCntr.querySelectorAll('font > a');

// add space for uniform indent
var sp = document.createTextNode('　');
threadListCntr.insertBefore(sp, threadList[0]);

for (var i=0; i<threadList.length; i++) {
    threadList[i].style.setProperty('font-size',       '16px')
    threadList[i].style.setProperty('text-decoration', 'none')
    threadList[i].style.setProperty('display',         'inline-block')
    threadList[i].style.setProperty('margin',          '2px')

    if (i<20 && i%2==0) continue; // jump seperated top 10 anchor links
    var br = document.createElement('br');
    threadListCntr.insertBefore(br, threadList[i].nextSibling)
    }
