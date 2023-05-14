// function component() {
//   const element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//   return element;
// }

// document.body.appendChild(component());
import "./index.css"
import { addZoom, addPosition, toggleDisplay, startModel, } from "./model"
import "./rtc"
import {setLoadModelEvent} from "./fs"

document.querySelector('#zoomin').onclick = ()=>addZoom(0.05)
document.querySelector('#zoomout').onclick =()=>addZoom(-0.05)
document.querySelector('#moveup').onclick = ()=>addPosition(0, -0.04)
document.querySelector('#movedown').onclick =()=>addPosition(0, 0.04)
document.querySelector('#display').onclick = ()=>toggleDisplay()
addEventListener('resize', ()=>{
    addPosition(0, 0)
    addZoom(0)
});
setLoadModelEvent(startModel)