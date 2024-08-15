import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FadeLoader } from 'react-spinners';

function App() {
  const [image, setImage] = useState("");
  const [file, setfile] = useState();
  const [info, setInfo] = useState({
    prevSize: 0,
    newSize: 0,
    percent: 0
  })
  const [Extention, setExtention] = useState(".png");
  const [isloading, setisLoading] = useState(false);
  const [Quality, setQuality] = useState(92);
  const handleChange = function (e) {
    const fileName = e.target.files[0].name;
    console.log(e.target.files[0]);
    setExtention(".".concat(fileName.split(".")[1]));
    setfile(e.target.files[0]);

  }
  function downloadImage() {
    if (!image) {
      return;
    }

    const a = document.createElement('a');
    a.href = image;
    a.download = 'Optimized-Image'.concat(Extention);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const OptImage = async () => {
    try {
      console.log(file.type)
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        window.alert("File Format not supported (supported : PNG, JPG)");
        return;
      }

      if (file.size / 1024 > 5000) {
        window.alert("File Size Should be below 5MB");
        return;
      }
      setisLoading(true);
      const formData = new FormData();
      formData.append("UploadFile", file);
      formData.append("Quality", Quality);
      const res = await axios({
        url: "https://image-optimization-backend.vercel.app/UploadImage",
        // url: "http://localhost:8000/UploadImage",
        method: 'post',
        data: formData
      });
      if (res.data) {
        console.log(res.data)
        const { image: base64Image, newSize, prevSize, percent } = res.data;
        setInfo({ newSize, prevSize, percent })
        const blob = new Blob([Uint8Array.from(atob(base64Image), c => c.charCodeAt(0))], { type: 'image/png' });
        const objectURL = URL.createObjectURL(blob);
        setisLoading(false);
        setImage(objectURL);
      }
    } catch (error) {

    }
  }
  return (
    <div className="App">
      <h2>Image Optimizer</h2>
      <h4>Note : You can specify the quality for jpeg files</h4>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 10 }}>
          <input  type="file" onChange={(e) => handleChange(e)}></input>
          Quality: <input type="number" defaultValue={Quality} onChange={(e) => setQuality(Number(e.target.value))}></input>
          <button style={{ marginLeft: 10 }} onClick={() => OptImage()}>Upload</button>
        </div>

        {image && <img src={image}></img>}
        <FadeLoader loading={isloading} />
        {image && <h4>File optimized by {info.percent}% from {Math.round(info.prevSize / 1024)}KB to {Math.round(info.newSize / 1024)}KB   </h4>}
        {image && <button onClick={downloadImage}>Download</button>}
      </div>
    </div>
  );
}

export default App;
