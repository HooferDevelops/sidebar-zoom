const { Plugin } = require('powercord/entities');
const { React, getModule, FluxDispatcher, i18n: { Messages } } = require('powercord/webpack');
const { description } = require('../pc-commands/commands/echo');
const { Powercord } = require('../pc-updater/components/Icons');

/* HAHAHA LOCALSTORAGE GO BRRRRRRRRRRRR, IMAGINE USING A REAL SETTINGS SYSTEM HAHA */

var totalZoom = window.localStorage.getItem("sidebar-zoom") || 1;
var style;

window.localStorage.setItem("sidebar-zoom", totalZoom);

module.exports = class SidebarZoom extends Plugin {
    

    startPlugin(){
        if (isNaN(window.localStorage.getItem("sidebar-zoom"))) {
            window.localStorage.setItem("sidebar-zoom", 1)
        }
        document.addEventListener('keydown', this.zoomCheck) 
        /* couldn't get Powercord's native keybind input to work,
        so i'll have to use this until i find a fix. */         
        style = document.createElement('style');
        document.head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(`.sidebar-2K8pFh{ zoom: ${totalZoom}; }`));
    }

    pluginWillUnload(){
        document.removeEventListener('keydown', this.zoomCheck)
        style.parentNode.removeChild(style);
    }

    zoomCheck(event) {
        if (event.code == 'Minus' && (event.ctrlKey || event.metaKey) && (event.shiftKey)) {
            if(totalZoom <= 0.15){
                totalZoom = 0.1;
            } else {
                totalZoom -= 0.1;
            }
        }
        if ((event.code == 'Equal' || event.Code == "Plus") && (event.ctrlKey || event.metaKey) && (event.shiftKey)) {
            totalZoom += 0.1;
        }
        if (event.code == 'KeyR' && (event.ctrlKey || event.metaKey) && (event.shiftKey)) {
            
            totalZoom = 1;
        }
        window.localStorage.setItem("sidebar-zoom", totalZoom);
        style.replaceChild(document.createTextNode(`.sidebar-2K8pFh{ zoom: ${totalZoom}; }`), style.childNodes[0]);
    };

};
