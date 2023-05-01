const appendButton = document.querySelector('#append');

const setLoadModelEvent = (callback) => {
    appendButton.onclick = (e)=>{
        var input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true
        input.directory = true
        input.multiple = true
        var urlMap = []
        var model3_file = null
        input.onchange = e => { 
            // console.log(e.target.files)
            var len = e.target.files.length
            for(var i=0;i<len;i++){
                const file = e.target.files[i]
                const reader = new FileReader();
                reader.onload = function() {
                    urlMap.push([
                        file.webkitRelativePath.slice(file.webkitRelativePath.indexOf('/')+1),
                        reader.result
                    ])
                    if(urlMap.length == len){
                        // console.log(urlMap, model3_file)
                        model3_file.text().then(model3_text=>{
                            urlMap.forEach(v=>{
                                model3_text = model3_text.replace(v[0], v[1])
                            })
                            var b = new Blob([model3_text], { type: 'application/json' })
                            callback(URL.createObjectURL(b))
                        })
                    }
                };
                reader.readAsDataURL(file);
                if(file.name.endsWith('.model3.json'))
                    model3_file = file
            }
        }
        input.click();
    }
}

export {
    setLoadModelEvent
}