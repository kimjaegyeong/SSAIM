// RemindDetailPage.tsx
import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './RemindDetailPage.module.css';
import remindBG from '../../assets/remind/remindBG.png';

// 표지 컴포넌트
const Cover = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div className={styles.cover} ref={ref}>
    <div className={styles.coverContent}>
      <h1 className={styles.h1}>레전드 프로젝트 1주차</h1>
      <p className={styles.p}>2024-10-14 ~ 2024-10-18</p>
    </div>
  </div>
));

// 이미지 페이지 props 타입 정의
interface ImagePageProps {
  image: string;
}

// 회고 페이지 props 타입 정의
interface ReportPageProps {
  report: string;
}

// 이미지 페이지 컴포넌트
const ImagePage = React.forwardRef<HTMLDivElement, ImagePageProps>(
  ({ image }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.imagePageContent}>
        <img src={image} alt="Weekly review" className={styles.weeklyImage} />
      </div>
    </div>
  )
);

// 회고 내용 페이지 컴포넌트
const ReportPage = React.forwardRef<HTMLDivElement, ReportPageProps>(
  ({ report }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.reportPageContent}>
        {report}
      </div>
    </div>
  )
);

const RemindDetailPage: React.FC = () => {
  const weeklyData = [
    {
      image: "/path-to-image-1.jpg",
      report: "수업의 프로젝트 일기\n정보를 주고받는 것에서 시작한 것이 지금은 서로 문제를 다시 실험하는 곳으로 사례되다. 이 모든 문제의 답은..."
    },
    {
      image: "/path-to-image-2.jpg",
      report: "두 번째 주간 회고 내용..."
    }
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.bookWrapper}>
        <img src={remindBG} alt="remindBG" className={styles.remindBG} />
        <HTMLFlipBook
          width={600}
          height={700}
          size="fixed"
          minWidth={500}
          maxWidth={1000}
          minHeight={300}
          maxHeight={800}
          maxShadowOpacity={0.5}
          className={styles.book}
          showCover={true}
          drawShadow={true}
          startPage={0}
          flippingTime={1000}
          style={{ margin: '0 auto' }}
          usePortrait={false}
          startZIndex={0}
          autoSize={false}
          mobileScrollSupport={true}
          onFlip={(e) => console.log('Flipped to page: ', e.data)}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={0}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          <Cover />
          {weeklyData.flatMap((data, index) => [
            <ImagePage key={`image-${index}`} image={data.image} />,
            <ReportPage key={`report-${index}`} report={data.report} />
          ])}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default RemindDetailPage;