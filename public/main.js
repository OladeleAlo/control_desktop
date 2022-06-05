// importing using require
const {
    app,
    BrowserWindow,
    desktopCapturer,
    ipcMain,
    Menu,
} = require("electron")
const path = require("path")

let availableScreens
let mainWindow

const sendSelectedScreen = (item) => {
    mainWindow.webContents.send("SET_SOURCE_ID",item.id)
}
 const createTray = ()=> {
     const screensMenu = availableScreens.map(item => {
         return {
             label:item.name,
             click:()=> {
                 sendSelectedScreen(item)

             }
         }
     })
     const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {role: "quit"}
            ]
        },
        { 
            label: "Screens",
           submenu: screensMenu
       }
       
    ])
    Menu.setApplicationMenu(menu)
 }


// create a method for our browser window

const createWindow = () => {
     mainWindow  = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            preload:path.join(__dirname,"preload.js")
        }
    })

    ipcMain.on("set-size",(event,size)=> {
       const {width,height} = size
       try{
            mainWindow.setSize(width,height,true)
       } catch(e){
           console.log(e)
       }
    })

    //make sure electron is loading the right url
    mainWindow.loadURL("http://localhost:3000/")

    //then once the main window is ready,we change its state to show
    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
        mainWindow.setPosition(0,0)

        desktopCapturer.getSources({
            types:["window","screen"]
        }).then(sources => {
            availableScreens = sources
            createTray()
            // for (const source of sources){
            //     console.log(source.display_id)
            //     console.log(source.name)
            //     // sending the source id to the renderer (which is the react app)
            //     // we first send it to preloadjs
            //     if(source.name === "Entire Screen") {
            //         mainWindow.webContents.send("SET_SOURCE_ID",source.display_id)
            //         // create the preload file in the public folder

            //     }
            // }
            
        })

    })

    //to show the printout of our sourceId
    mainWindow.webContents.openDevTools()
}

//then when the app is ready we call the react window
app.on("ready", ()=> {
    createWindow()

    //to make sure it does not run in browser 
    // goto package.json and add BROWSER= none to the start script
});