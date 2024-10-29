import React, { ReactNode } from "react";
import styles from './Modal.module.css';

// 공통 모달 컴포넌트 사용법
// isOpen: 모달 상태 변수
// onClose: 모달 닫히는 함수
// title: 모달 제목
// content: 모달 내용
// footer?: 버튼
// width?: 너비(px), 기본값 300px
// height?: 높이(px), 기본값 200px

// 사용 예시
// <Modal
//   isOpen={isModalOpen}
//   onClose={closeModal}
//   title={
//     // "유저 삭제"
//     <>
//       제목도 두줄 가능합니까<br />
//       일단은요
//     </>
//   }
//   content={
//     // "정말로 삭제하시겠습니까?"
//     <>
//       정말로 삭제하시겠습니까?<br />
//       삭제하면 되돌릴 수 없습니다.
//     </>
//   }
//   footer={
//     <>
//       <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//         파랑
//       </button>
//       <button style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//         빨강
//       </button>
//     </>
//   }
//   // width={500}
//   height={250}
// />

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  width?: number;
  height?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  footer,
  width = 300,
  height = 200,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackground} onClick={onClose}>
      <div
        className={styles.modalContainer}
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 타이틀 */}
        <div className={styles.modalHeader}>{title}</div>

        {/* 컨텐츠 */}
        <div className={styles.modalContent}>{content}</div>

        {/* 푸터 (버튼 영역) */}
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
