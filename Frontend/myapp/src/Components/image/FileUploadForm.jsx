import React, { useState } from 'react'
import axios from 'axios';
export default function Fileuploadform() {
    const[selectedFile,setSelectedFile]=useState(null);
    const handlefileChange=(event)=>{
        setSelectedFile(event.target.files[0])

    }
    const handleUpload = async () => {
      if(!selectedFile){
        alert("please a file before uploading");
        return;
      }
        try {
          const formData = new FormData();
          formData.append('image', selectedFile);
    
          await axios.post('http://localhost:5000/api/uploadimages', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          alert('Image uploaded successfully!');
        } catch (error) {
          console.error('Image upload failed!', error);
        }
      };
     
  return (
    <div>
        <h2>File upload</h2>
        <input type="file"  onChange={handlefileChange} />
        <button onClick={handleUpload}>Upload Image</button>
    </div>
  )
}
