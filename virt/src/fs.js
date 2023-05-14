const appendButton = document.querySelector('#append');
const prevButton = document.querySelector('#prevmodel');
const nextButton = document.querySelector('#nextmodel');

const setLoadModelEvent = (callback) => {
    let modelIndex = 0
    let modelUrls = []
    appendButton.onclick = (e)=>{
        var input = document.createElement('input');
        input.type = 'file';
        input.accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
        input.onchange = e => { 
            // console.log(e.target.files)
            // loadFilesToModel(e.target.files)
            var file = e.target.files[0];
            unzip(file).then(files=>{
                loadFilesToModel(files).then(urls=>{
                    modelUrls.forEach(url=>URL.revokeObjectURL(url))
                    modelUrls = urls
                    modelIndex = 0
                    callback(modelUrls[modelIndex])
                })
            })
        } 
        input.click();
    }
    prevButton.onclick = ()=>{
        modelIndex -= 1
        callback(modelUrls[modelIndex % modelUrls.length])
    }
    nextButton.onclick = ()=>{
        modelIndex += 1
        callback(modelUrls[modelIndex % modelUrls.length])
    }
}

async function unzip(file){
    const zip = new JSZip();
    const zipObjectFiles = Object.values((await zip.loadAsync(file)).files)
    const files = []
    for(var zipObjectFile of zipObjectFiles){
        const f = await zipObjectFile.async("blob")
        f.name = zipObjectFile.name
        files.push(f)
    }
    return files
}

async function readFileAsync(file){
    const reader = new FileReader();
    return new Promise((resolve, reject)=>{
        reader.onload = ()=>{
            resolve(reader.result)
        }
        reader.readAsDataURL(file)
        reader.onerror = reject
    })
} 

async function loadFilesToModel(files){
    var model3_files = []
    for(var file of files){
        if(file.name.endsWith('.model3.json')){
            const pathSplit = file.name.split('/')
            pathSplit.pop()
            model3_files.push({
                base: pathSplit.join('/') + (pathSplit.length>0?'/':''),
                file,
                urlMap: []
            })
        }
    }
    for(var file of files){
        const result = await readFileAsync(file)
        for (var j=0;j<model3_files.length;j++){
            const base = model3_files[j].base
            if (file.name.startsWith(base) && !file.name.endsWith('/')){
                model3_files[j].urlMap.push({
                    name: file.name.replace(base, ''),
                    result
                })
            }
        }
    }
    const results = []
    for(var model3_file of model3_files){
        let model3_text = await model3_file.file.text()
        model3_file.urlMap.forEach(v=>{
            model3_text = model3_text.replace(v.name, v.result)
        })
        results.push(URL.createObjectURL(new Blob([model3_text], { type: 'application/json' })))
    }
    return results
}

export {
    setLoadModelEvent
}