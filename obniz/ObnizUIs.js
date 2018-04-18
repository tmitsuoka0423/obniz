const ObnizSystemMethods = require('./ObnizSystemMethods')

module.exports = class ObnizUIs extends ObnizSystemMethods {

  constructor(id, options) {
    super(id, options)
  }

  wsconnect(desired_server) {
    if (this.isNode === false) {
      this.showOffLine();
    }
    if (!this.isValidObnizId(this.id)) {
      if (this.isNode) {
        this.error("invalid obniz id");
      }
      else {
        let filled = _ReadCookie("obniz-last-used") || "";
        this.prompt(filled, function (obnizid) {
          this.id = obnizid;
          this.wsconnect(desired_server);
        }.bind(this));
      }
      return;
    }
    super.wsconnect(desired_server);
  }

  showAlertUI(obj) {
    if (this.isNode || !document.getElementById(this.options.debug_dom_id)) {
      return;
    }
    const alerts = {
      warning: 'alert-warning alert-dismissible',
      error: 'alert-danger'
    };
    let dom = `
    <div style="background-color:${obj.alert === "warning" ? "#ffee35" : "#ff7b34"  }">${obj.message}</div>`;
    document.getElementById(this.options.debug_dom_id).insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms(){
    if (this.isNode){return;}
    let loaderDom = document.querySelector("#loader");
    let debugDom = document.querySelector("#" + this.options.debug_dom_id);
    let statusDom = document.querySelector("#"+this.options.debug_dom_id +" #online-status");
    if(debugDom && !statusDom){
      statusDom = document.createElement("div");
      statusDom.id = 'online-status';
      statusDom.style.color =  "#FFF";
      statusDom.style.padding =  "5px";
      statusDom.style.textAlign =  "center";
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom:loaderDom, debugDom:debugDom, statusDom:statusDom };
  }

  showOnLine() {
    if (this.isNode){return;}
    let doms = this.getDebugDoms();
    if(doms.loaderDom){
      doms.loaderDom.style.display="none";
    }
    if(doms.statusDom){
      doms.statusDom.style.backgroundColor =  "#449d44";
      doms.statusDom.style.color =  "#FFF";
      doms.statusDom.innerHTML = this.id ? "online : "+ this.id : "online";
    }
  }

  showOffLine() {
    if (this.isNode){return;}

    let doms = this.getDebugDoms();
    if(doms.loaderDom){
      doms.loaderDom.style.display="block";
    }
    if(doms.statusDom){
      doms.statusDom.style.backgroundColor =  "#d9534f";
      doms.statusDom.style.color =  "#FFF";
      doms.statusDom.innerHTML = this.id  ? "offline : "+ this.id : "offline";
    }
  }
}

function _ReadCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}