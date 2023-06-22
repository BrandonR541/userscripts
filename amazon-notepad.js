// ==UserScript==
// @name         Amazon Notepad
// @namespace    https://github.com/BrandonR541/userscripts
// @version      0.1
// @description  Lets you annotate Amazon products. Uses localStorage.
// @author       LeoDupont
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.mx/*
// @match        https://www.amazon.br/*
// @match        https://www.amazon.jp/*
// @match        https://www.amazon.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.fr
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////
// Amazon Notepad
//
// Displays a simple text input under the product's name
//  * on product pages (always),
//  * on search results pages (if notes were found).
//
// Notes are saved on 'change' event.
// => the input need to loose focus for the event to be triggered,
// => a simple Tab or a click away will do the job.
//
// Uses the browser's localStorage to store notes.
// => notes are not synced anywhere on the Internet.
////////////////////////////////////////////////////////////////////

var $ = window.$; // Declaration

(function() {
  'use strict';

  // === Product Page ===

  var pageId = getProductIdFromUrl(document.URL);
  if (pageId) {
    var pageNotes = loadProductNotes(pageId);
    showNotepad(pageId, pageNotes, '#titleSection');
  }

  // === Search Results Page ===

  $('h2.a-size-mini > a.a-link-normal').each(function(i, elm) {
    var productId = getProductIdFromUrl(elm.href);
    if (productId) {
      var productNotes = loadProductNotes(productId);
      if (productNotes) {
        showNotepad(productId, productNotes, $(elm).parent().parent());
      }
    }
  });

})();

// =======================================================
// == Helpers
// =======================================================

function getProductIdFromUrl(url) {
  var match = url.match(/\/(\w{10})/);
  if (match) {
      return match[1];
  }
}

// =======================================================
// == Original UI Function from LeoDupont
// =======================================================
/* function showNotepad(productId, value, elmToAppendTo) {
  $('<input>')
    .attr({
      id: 'amazon-notepad-' + productId,
      name: 'amazon-notepad',
      style: 'width: 100%; margin: 10px 0; background-color: lightyellow;',
      value: value,
      placeholder: 'Amazon Notepad...',
    })
    .appendTo(elmToAppendTo)
    .change(function(e) {
      var newNotes = e.target.value;
      console.log('[AMAZON NOTEPAD] Storing new notes for ' + productId + ': ' + newNotes);
      saveProductNotes(productId, newNotes);
    });
} */

// =======================================================
// == Tweaked UI Funtion:
// =======================================================
//
//        -> Toggle switch added to hide note section
//                Pages with no notes default to hidden
//                Pages with notes default to open
//                Search results only show the toggle for pages with notes and defaults to open
//
//        -> Changed from single line input to multiline
//                Displays all lines instead of using a scroll bar
//                Text input area automatically grows in height as you type
//                
//        -> Color and font changes due to personal preference
//
// =======================================================
function showNotepad(productId, value, elmToAppendTo) {

  //--------------------------
  // Toggle Switch Background
  //--------------------------
  const switchContainer = $('<div>')
    .attr({
      id:    'amazon-notepad-switch-' + productId,
      style: 'display:                inline-block;\
              vertical-align:         middle;\
              position:               relative;\
              width:                  50px;\
              height:                 20px;\
              background-color:       #fadaeb;\
              border-radius:          10px;\
              cursor:                 pointer;',
    })
    .appendTo(elmToAppendTo);


  //--------------------------
  // Toggle Switch Handle
  //--------------------------
  const switchHandle = $('<div>')
    .attr({
      id:    'amazon-notepad-switch-handle-' + productId,
      style: 'position:               absolute;\
              top:                    2px;\
              left:                   2px;\
              width:                  16px;\
              height:                 16px;\
              background-color:       #b19aa6;\
              border-radius:          50%;\
              transition:             left 0.2s ease;',
    })
    .appendTo(switchContainer);


  //--------------------------
  // Text Field Style
  //--------------------------
  const textarea = $('<textarea>')
    .attr({
      id: 'amazon-notepad-' + productId,
      name: 'amazon-notepad',
      style: 'display:                none;\
              width:                  100%;\
              margin:                 10px 0;\
              background-color:       #fa8dc7;\
              color:                  black;\
              font-size:              17px;\
              resize:                 none;\
              overflow:               hidden;',
      placeholder: 'Amazon Notepad...',
    })
    .val(value)
    .appendTo(elmToAppendTo);


  //--------------------------
  // Text Field Display Logic
  //--------------------------
  const handleWidth = switchHandle.outerWidth();
  const containerWidth = switchContainer.outerWidth();
  const handleLeftPosition = containerWidth - handleWidth - 2;

  const toggleNotepad = function() {
    const textareaEl = textarea[0];
    const handleEl = switchHandle[0];

    if (textareaEl.style.display === 'none') {
      textareaEl.style.display = '';
      textareaEl.style.height = ''; // Reset the height first
      textareaEl.style.height = `${textareaEl.scrollHeight}px`; // Set the height to fit the content
      handleEl.style.left = `${handleLeftPosition}px`;
    } else {
      textareaEl.style.display = 'none';
      handleEl.style.left = '2px';
    }
  };

  switchContainer.on('click', toggleNotepad);

  textarea.on('input', function(e) {
    const textareaEl = e.target;
    textareaEl.style.height = ''; // Reset the height first
    textareaEl.style.height = `${textareaEl.scrollHeight}px`; // Set the height to fit the content

    const newNotes = e.target.value;
    console.log('[AMAZON NOTEPAD] Storing new notes for ' + productId + ': ' + newNotes);
    saveProductNotes(productId, newNotes);
  });

  // Expand the textarea initially to fit the content if there is existing text
  if (value.trim() !== '') {
    textarea.trigger('input');
    switchHandle.css('left', `${handleLeftPosition}px`);
    textarea.show().trigger('input'); // Trigger input event explicitly
  }
}

// =======================================================
// == Storage
// =======================================================

function loadProductNotes(productId) {
  return localStorage.getItem('amazon-notepad-' + productId);
}

function saveProductNotes(productId, notes) {
  localStorage.setItem('amazon-notepad-' + productId, notes);
}
