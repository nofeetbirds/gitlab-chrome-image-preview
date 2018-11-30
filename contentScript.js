var config = require('./config');
var axios = require('axios');
var lodash = require('lodash');
var gitlab = require('./gitlab');

var showedIframe = null;

console.log('Gitlab Merge Request image preview extension loaded');

var gitlab_axios_instance = axios.create({
  baseURL: config.api_url,
  timeout: 10000,
  headers: { "PRIVATE-TOKEN": config.token}
});

function getText(node, lineSeparator){
  var text = "";
  while(node != null){
    if(node.nodeType == Node.TEXT_NODE){
      text += node.nodeValue.trim();
    }else if(node.nodeType == Node.ELEMENT_NODE){
      if($(node).is(':visible')){
        var childText = ""; 
        if(node.firstChild != null){
          if(node.parentNode.nodeName == "SELECT" && node.nodeName == "OPTION"){
            // Get selected option text only
            if(node.parentNode[node.parentNode.selectedIndex] == node){
              childText = getText(node.firstChild, lineSeparator);
            }
          }else{
            childText = getText(node.firstChild, lineSeparator);
          }
        }

        if(childText != ""){
          text += childText;
        }

        if(node.nodeName == "BR" || window.getComputedStyle(node, null).display.indexOf("inline") === -1){
          text += lineSeparator;
        }
      }
    }

    node = node.nextSibling;
  }

  return text.trim();
}

window.addEventListener ("load", myMain, false);

document.addEventListener("pointerup", function(event){
  if(showedIframe){
    showedIframe.fadeOut(300,"swing");
    showedIframe = null;
  }
});

document.addEventListener("pointerdown", function(event){
  if (event.metaKey)  {
    event.preventDefault();
    var rect = event.target.getBoundingClientRect();
    var frame = document.createElement("div");
    frame.style.position = "absolute";
    frame.style.top = (rect.top + window.scrollY) + "px";
    frame.style.left = (rect.left + window.scrollX) + "px";
    frame.style.width = 30 + "%";
    frame.style.height = 30 + "%";
    frame.style.border = "solid 2px gold";
    frame.style.borderRadius = "5px";
    frame.style.zIndex = "99999";
    frame.style.pointerEvents = "none";
    document.body.appendChild(frame);
    if(!showedIframe){
      showedIframe = $(frame).fadeIn(300, "swing");
    }
  }
}, false);

function myMain () {

}
