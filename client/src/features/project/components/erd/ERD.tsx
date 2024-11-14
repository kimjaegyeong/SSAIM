import React, { useRef, useState, useEffect } from "react";
import styles from "./ERD.module.css";
import { getErd, postErd, patchErd } from "../../apis/webSocket/erd";

interface ERDProps {
  projectId: string;
}

const ERD: React.FC<ERDProps> = ({ projectId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 이미지 상태
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const defaultImageUrl = "https://via.placeholder.com/300"; // 기본 이미지 경로


  const fetchErd = async () => {
    try {
      const response = await getErd(projectId);
      if (response === 'fail') {
        setImageUrl(null);
        return;
      }
      setImageUrl(response); // 서버에서 받은 이미지 URL로 설정
    } catch (error) {
      console.error("Error fetching ERD:", error);
    }
  };

  useEffect(() => {
    fetchErd();
  }, [projectId]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();

      // 파일 객체를 그대로 FormData에 추가
      formData.append("ErdImage", file);

      try {
        if (imageUrl === null) {
          // 이미지가 null일 경우 POST 요청
          postErd(projectId, formData)
            .then(() => {
              fetchErd();
            })
            .catch((error) => {
              console.error("Error uploading ERD:", error);
            });
        } else {
          // 이미지가 있을 경우 PATCH 요청
          patchErd(projectId, formData)
            .then(() => {
              fetchErd();
            })
            .catch((error) => {
              console.error("Error updating ERD:", error);
            });
        }
      } catch (error) {
        console.error("Error uploading ERD:", error);
      }
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 선택 창 열기
    }
  };

  return (
    <div className={styles.erd}>
      <button onClick={handleEditClick} className={styles.editButton}>
        편집
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <img
        src={imageUrl || defaultImageUrl} // 이미지 상태가 null이면 기본 이미지를 표시
        alt="ERD Image"
        className={styles.erdImage}
      />
    </div>
  );
};

export default ERD;
