const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

var style, get, set, totalZoom, sidebar;

function template(scale){
    return `
    .${sidebar} > nav {
        transform: scale(${scale});
        width: ${100/(scale*100)*100}%;
        transform-origin: 0 0;
    }
    .${sidebar} > section {
        transform: scale(${scale});
        width: ${100/(scale*100)*100}%;
        transform-origin: 0 100%;
    }
    .${sidebar} {
        width: ${240*scale}px;
    }
    `
}

module.exports = class SidebarZoom extends Plugin {
    async startPlugin(){
        sidebar = await getModule(['activityPanel'])
        sidebar = sidebar.sidebar

        // settings stuff
        get = this.settings.get;
        set = this.settings.set;
        if (!get("sidebar-zoom-amt"))
            set("sidebar-zoom-amt", 1)
        totalZoom = get("sidebar-zoom-amt");

        document.addEventListener('keydown', this.zoomCheck) 
        /* couldn't get Powercord's native keybind input to work,
        so i'll have to use this until i find a fix. */   

        // my super cool css manager
        style = document.createElement('style');
        document.head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(template(totalZoom)));
    }

    pluginWillUnload(){
        // remove styling and keydown check
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
        set("sidebar-zoom-amt", totalZoom)
        style.replaceChild(document.createTextNode(template(totalZoom)), style.childNodes[0]);
    };
};
