import React, { useEffect, useState } from 'react';

export default function Displayingimage() {
    const [imageUrls, setImageUrls] = useState([]);
console.log("image",imageUrls);

    useEffect(() => {
        fetch('http://localhost:5000/api/getImages')
            .then((response) => response.json())
            .then((data) => {
                setImageUrls(data.imageFilenames); // Assuming 'data.imageFilenames' is an array of image filenames
            })
            .catch((error) => {
                console.error('Error fetching images', error);
            });
    }, []);

    const baseURL = "http://localhost:5000/uploads/images";
    
    return (
        <div style={{ width: "700px", display: "flex", flexDirection: "column" }}>
            <h2>Images</h2>
            {
                imageUrls && imageUrls.map((imageUrl, index) => (
                    <div key={index} style={{ width: 200, height: 200 }}>
                        <img alt="img" width={100} height={100} src={`${baseURL}/${imageUrl.filename}`} />
                        {console.log(`${baseURL}/${imageUrl.filename}`)}
                        

                    </div>
                    
                ))
            }
        </div>
    );
}
