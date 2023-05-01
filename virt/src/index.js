// function component() {
//   const element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//   return element;
// }

// document.body.appendChild(component());
import "./index.css"
import { currentModel, startModel } from "./model"
import "./rtc"
import {setLoadModelEvent} from "./fs"

addEventListener('resize', (event) => {
    currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
});
setLoadModelEvent(startModel)