import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { FadeLoader } from 'react-spinners';

function App() {
  const [image, setImage] = useState("");
  const [file, setfile] = useState();
  const [info,setInfo] = useState({
    prevSize:0,
    newSize:0,
    percent:0
  })
  const [isloading, setisLoading] = useState(false);
  const handleChange = function (e) {
    console.log(e.target.files[0])
    setfile(e.target.files[0]);
  }
  function downloadImage() {
    if (!image) {
      return;
    }

    const a = document.createElement('a');
    a.href = image;
    a.download = 'Optimized-Image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const OptImage = async () => {
    try {
      setisLoading(true);
      const formData = new FormData();
      formData.append("UploadFile", file)
      const res = await axios({
        url: "https://image-optimization-backend.vercel.app/UploadImage",
        // url:"http://localhost:8000/UploadImage",
        method: 'post',
        data: formData
      });
      if (res.data) {
        console.log(res.data)
        const { image,newSize,prevSize,percent } = res.data;
        setInfo({newSize,prevSize,percent})
        const downloadResponse = await axios.get(image, {
                responseType: 'arraybuffer', // Important for downloading files
        });
        console.log(downloadResponse.data)
       
        const blob = new Blob([downloadResponse.data], { type: 'image/png' });
        const objectURL = URL.createObjectURL(blob);
        setisLoading(false);
        setImage(objectURL);
      }
    } catch (error) {

    }
  }
  return (
    <div className="App">
       <meta 
     http-equiv="Content-Security-Policy"   
     content="upgrade-insecure-requests" 
    />
      <h2>Image Optimizer</h2>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{marginBottom:10}}>
      <input type="file" onChange={(e) => handleChange(e)}></input>
      <button onClick={() => OptImage()}>Upload</button>
      </div>

      {image && <img src={image}></img>}
      <FadeLoader loading={isloading} />
      {image && <h4>File optimized by {info.percent}% from {Math.round(info.prevSize/1024)}KB to {Math.round(info.newSize/1024)}KB   </h4>}
      {image && <button onClick={downloadImage}>Download</button>}
      </div>
    </div>
  );
}

export default App;
