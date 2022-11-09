export { default as useColorScheme } from './hooks/useColorScheme';
export { default as Navigation, initScreenModule } from './navigation';
export { default as Config } from './navigation/Config';
import _ from 'lodash';
import { initScreenModule } from './navigation';
import { pushNavigators } from './navigation/DrawerNavigator';
import { pushPathConfig } from './navigation/LinkingConfiguration';
import { ScreenPackage } from './types';

if (process.versions && process.versions['electron']){
    (function() {  // for electron
        var proxied = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function() {
        if(window.location.href != window.location.origin + '/'){
            sessionStorage.setItem('_href', window.location.href)
        }
        window.history.replaceState(null, '', window.location.origin)    
        var arr:any = []
        return proxied.apply(this, arr.slice.call(arguments));
        };
    })();
}
    
    
(function(l) {  // for github-page
    if (l !== undefined && l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, '',
            l.pathname.slice(0, -1) + decoded + l.hash
        );
    }
}(window.location))
    
const ignoreWarnings = ['ReactNativeFiberHostComponent'];
const _console = _.clone(console);
console.warn = (message: string|Object) => {
    var warn = true;
    if (message instanceof Object)
    warn = false;
    else{
    ignoreWarnings.forEach((value)=>{
        if (message.indexOf && message.indexOf(value) <= -1) {
            warn = false;
        }
    })
    };
    if (warn){
        _console.warn(message);
    }
    else{
        // console.log(message)
    }
};

export function useScreenModule(screenPackages:ScreenPackage[], screenKeyList?:string[]){
    if (process.versions && process.versions['electron']){  // for electron
        if (process.platform == 'win32' && process.env.NODE_ENV == 'production'){
          window.history.replaceState(null, '', 'file:///')
        }
        else{
          var _href = sessionStorage.getItem('_href')
          window.history.replaceState(null, '', _href || '/')
        }
    }
    screenPackages.forEach(screens=>{
        pushNavigators(screens)
        pushPathConfig(screens)
    })
    initScreenModule(screenPackages, screenKeyList)
}