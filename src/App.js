
import './App.css';
import {useRef,useEffect} from "react"

function App() {
  const videoRef = useRef()
  const getStream = async (display_id)=>{
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video : {
          mandatory:{
            chromeMediaSource:"desktop",
            chromeMediaSourceId:display_id
          }
        }
      })

    } catch(e) {
      console.log(e)
    }
  }

  const handleStrem = (stream) => {
   // let {width,height} = stream.getVideoTracks()[0].getSettings()

   // window.electronAPI.setSize({width,height})

    //send width and height to main process via the preload
    videoRef.current.srcObject = stream
    videoRef.current.onloadedmetadata = (e) => videoRef.current.play()

  }

 window.electronAPI.getScreenId((event,display_id) =>{
   console.log("Renderer...",display_id)
   getStream(display_id)
 })


  return (
    <div className="App">
      <>
      <span>800  x 600</span>
      <video ref={videoRef} className= "video">Video not available</video>
      </>
    </div>
  );
}
// add desktop capture to main.js
export default App;
