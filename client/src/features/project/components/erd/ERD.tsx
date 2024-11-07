import React, { useRef, useState } from "react";
import styles from "./ERD.module.css";

const ERD: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>(
    "https://via.placeholder.com/300"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.erd}>
      <button onClick={handleEditClick} className={styles.editButton}>편집</button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <img
        src={imageUrl}
        alt="Temporary Image"
        className={styles.erdImage}
      />
    </div>
  );
};

export default ERD;
