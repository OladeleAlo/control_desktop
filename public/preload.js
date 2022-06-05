const {ipcRenderer,contextBridge} = require("electron")

//receiving source id from main.js


// for the renderer to make use of screen id we use contextBridge
//let screenId
//ipcRenderer.on("SET_SOURCE_ID", async(event,display_id) => {
//    console.log(display_id)
//    screenId = display_id
//})


// creating contextBridge
contextBridge.exposeInMainWorld("electronAPI",{
    setSize:(size)=> ipcRenderer.send("set-size",size),
    getScreenId: (callback) => ipcRenderer.on("SET_SOURCE_ID",callback)
})