(()=>{"use strict";class t{constructor(){this.data=new Map}setData(t,e){this.data.set(t,e)}getData(t){return this.data.get(t)}erase(t){this.data.delete(t)}cleanup(){this.data.clear()}}class e{constructor(){this.newkey=new Array(256),this.oldkey=new Array(256),document.addEventListener("keydown",this.onKeyDown.bind(this)),document.addEventListener("keyup",this.onKeyUp.bind(this))}onKeyDown(t){for(let e=0;e<256;e++)t.keyCode==e&&(this.oldkey[e]=this.newkey[e],this.newkey[e]=!0)}onKeyUp(t){for(let e=0;e<256;e++)t.keyCode==e&&(this.oldkey[e]=this.newkey[e],this.newkey[e]=!1)}getKeyDown(t){return this.newkey[t]}getKeyUp(t){return!this.newkey[t]&&this.oldkey[t]}getKeyPressed(t){return this.newkey[t]&&!this.oldkey[t]}}class s{constructor(t,e){this.x=0|t,this.y=0|e}set(t,e){this.x=t,this.y=e}add(t){this.x+=t.x,this.y+=t.y}subtract(t){this.x-=t.x,this.y-=t.y}multiply(t){this.x*=t.x,this.y*=t.y}divide(t){this.x/=t.x,this.y/=t.y}squareMagnitude(){return this.x*this.x+this.y*this.y}magnitude(){return Math.sqrt(this.squareMagnitude())}normalize(){let t=this.magnitude();this.x/=t,this.y/=t}normalized(t,e){let i=new s(t,e);return i.normalize(),i}distance(t){let e=t.x-this.x,s=t.y-this.y;return Math.sqrt(e*e+s*s)}equals(t){return this.x==t.x&&this.y==t.y}dot(t){return this.x*t.x+this.y*t.y}clamp(t,e){this.x=Math.max(Math.min(this.x,e),t),this.y=Math.max(Math.min(this.y,e),t)}static lerp(t,e,i){return new s(t.x+(e.x-t.x)*i,t.y+(e.y-t.y)*i)}static clone(t){return new s(t.x,t.y)}static subtract(t,e){return s.clone(t).subtract(e)}static Zero(){return new s(0,0)}static One(){return new s(1,1)}static Up(){return new s(0,1)}static Down(){return new s(0,-1)}static Left(){return new s(-1,0)}static Right(){return new s(1,0)}}class i{constructor(){this.position=s.Zero(),document.addEventListener("mousemove",this.onMouseMove.bind(this)),document.addEventListener("mousedown",this.onMouseDown.bind(this)),document.addEventListener("mouseup",this.onMouseUp.bind(this))}onMouseMove(t){this.position.set(t.clientX,t.clientY)}onMouseDown(t){}onMouseUp(t){}getPosition(){return this.position}getLeftClick(){return!0}getRightClick(){return!0}}class n{constructor(){this.newPosition=s.Zero(),this.position=s.Zero()}update(){this.position=s.lerp(this.newPosition,this.position,.03)}setPosition(t,e){this.newPosition.set(t,e)}getWorldToScreen(){}getScreenToWorld(){}}class a{constructor(){this.canvas=document.getElementById("canvas"),this.context=this.canvas.getContext("2d")}cleanup(){this.context.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight)}setStrokeColor(t){this.context.strokeStyle=t}setFillColor(t){this.context.fillStyle=t}drawCircle(t,e,s){this.context.arc(t,e,s,0,2*Math.PI,!1)}drawFill(){this.context.fill()}drawStroke(){this.context.stroke()}startPath(){this.context.beginPath()}closePath(){this.context.closePath()}}class o{constructor(t,e,i,n,a,o,r){this.player=t,this.id=e,this.type=i,this.position=new s(n,a),this.size=o,this.mass=this.size*this.size/100,this.color=r}update(t,e,s){this.setPosition(t,e),this.setSize(s)}setPosition(t,e){this.position.set(t,e)}setSize(t){this.size=t,this.mass=this.size*this.size/100}setColor(t){this.color=t}draw(t){t.startPath(),t.setFillColor(this.color),t.drawCircle(this.position.x,this.position.y,this.size),t.drawFill(),t.closePath()}}class r{constructor(t,e,i,n){this.gamecore=t,this.id=e,this.team=i,this.name=n,this.cells=[],this.totalMass=0,this.skinURL={},this.mousePosition=new s(0,0),this.zoomRange=1}create(){}update(){this.totalMass=this.cells.reduce(((t,e)=>t.mass+e.mass))}draw(t){}destroy(){this.cells.clear(),this.skinURL={}}addCell(t,e,s,i,n){const a=new o(this,t,e,s,i,n);this.cells.push(a),this.gamecore.viewCells.push(a)}updateCell(t,e,s,i){this.cells.find((e=>e.id==t)).update(e,s,i)}deleteCell(t){const e=this.cells.findIndex((e=>e.id==t));this.cells.splice(e,1),this.gamecore.splice(e,1)}setTeam(t){this.team=t}setName(t){this.name=t}setMousePosition(t,e){this.mousePosition.set(t,e)}setSkinURL(t,e){let s=this.skinURL;s[t]=e,this.skinURL=s}}class l{constructor(t){this.gamecore=t}create(){this.ws=new WebSocket("ws://localhost:3000"),this.ws.binaryType="arraybuffer",this.ws.onopen=this.onOpen.bind(this),this.ws.onmessage=this.onMessage.bind(this),this.ws.onclose=this.onClose.bind(this),this.ws.onerror=this.onError.bind(this)}onOpen(t){console.log("Socket Open")}onMessage(t){const e=new Reader(new DataView(t.data),0,!0);switch(e.getUint8()){case 0:this.setId(e);break;case 10:this.addPlayer(e),this.updatePlayer(e),this.deletePlayer(e);break;case 11:this.addCell(e),this.updateCell(e),this.deleteCell(e);break;case 12:this.updateTeamMember(e);break;case 20:this.serverMessage(e);break;case 21:this.chatMessage(e)}}onClose(t){console.log("Socket Close")}onError(t){console.log("Socket Error")}setId(t){let e=t.getUint32();this.gamecore.playerId=e}addPlayer(t){const e=t.getUint16();for(let s=0;s<e;s++){const e=t.getUint32(),s=t.getStringEX(),i=t.getStringEX(),n=new r(this.gamecore,e,s,i),a=t.getUint16();for(let e=0;e<a;e++){const e=t.getUint32(),s=t.getUint8(),i=t.getFloat32(),a=t.getFloat32(),o=t.getUint16(),r=t.getStringEX();n.addCell(e,s,i,a,o,r)}this.gamecore.allPlayers.setData(e,n)}}updatePlayer(t){const e=t.getUint16();for(let s=0;s<e;s++){const e=t.getUint32(),s=this.gamecore.allPlayers.getData();s.setTeam(t.getStringEX()),s.setName(t.getStringEX()),this.gamecore.allPlayers.setData(e,s)}}deletePlayer(t){const e=t.getUint16();for(let s=0;s<e;s++){const e=t.getUint32();this.gamecore.allPlayers.erase(e)}}addCell(t){const e=t.getUint16(),s=t.getUint16(),i=this.gamecore.allPlayers.getData(e);for(let e=0;e<s;e++){const e=t.getUint32(),s=t.getUint8(),n=t.getFloat32(),a=t.getFloat32(),r=t.getUint16();if(0==s)i.addCell(e,s,n,a,r),this.gamecore.allPlayers.setData(id,i);else{const t=new o(null,e,s,n,a,r,"yellow");this.gamecore.viewCells.push(t)}}}updateCell(t){const e=t.getUint16(),s=t.getUint16(),i=this.gamecore.allPlayers.getData(e);for(let e=0;e<s;e++){const e=t.getUint32(),s=t.getUint8(),n=t.getFloat32(),a=t.getFloat32(),o=t.getUint16();0==s?(i.updateCell(e,n,a,o),this.gamecore.allPlayers.setData(id,i)):this.gamecore.viewCells.find((t=>t.id==e)).update(n,a,o)}}deleteCell(t){const e=t.getUint16(),s=t.getUint16(),i=this.gamecore.allPlayers.getData(e);for(let e=0;e<s;e++){const e=t.getUint32();if(0==t.getUint8())i.deleteCell(e),this.gamecore.allPlayers.setData(e,i);else{const t=this.gamecore.viewCells.findIndex((t=>t.id==e));this.gamecore.viewCells.splice(t,1)}}}updateTeamMember(t){const e=t.getUint16(),s=t.getUint16(),i=this.gamecore.allPlayers.getData(e);for(let e=0;e<s;e++){const e=t.getFloat32(),s=t.getFloat32();i.setMousePosition(e,s)}}serverMessage(t){}chatMessage(t){}}const h=new class{constructor(){this.viewCells=[],this.allPlayers=new t,this.skinURLCache=new t,this.playerId=-1,this.player=null,this.mouse=null,this.keyboard=null,this.camera=null}create(){this.render=new a,this.socket=new l(this),this.mouse=new i,this.keyboard=new e,this.camera=new n}update(){}draw(){this.render.cleanup(),this.viewCells.sort(((t,e)=>t-e)),this.viewCells.forEach((t=>{t.draw(this.render)})),this.player&&this.player.draw(this.render)}};!function t(){h.create(),h.update(),requestAnimationFrame(t)}()})();