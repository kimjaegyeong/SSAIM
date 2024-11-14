import React from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import styles from './RemindDetailPage.module.css';
import remindBG from '../../assets/remind/remindBG.png';
import { DevelopStoryDTO } from '@features/remind/types/DevelopStoryDTO';

interface CoverProps {
  project: DevelopStoryDTO;
  pageIndex: number;
}

// 표지 컴포넌트
const Cover = React.forwardRef<HTMLDivElement, CoverProps>(
  ({ project, pageIndex }, ref) => (
    <div className={styles.cover} ref={ref}>
      <div className={styles.coverContent}>
        <h1 className={styles.projectName}>{project.projectName}</h1>
        <p className={styles.projectDate}>{project.projectStartDate} ~ {project.projectEndDate}</p>
      </div>
      <div className={styles.pageNumber}>- {pageIndex + 1} -</div>
    </div>
  )
);

// 이미지 페이지 props 타입 정의
interface ImagePageProps {
  image: string;
  pageIndex: number;
}

// 회고 페이지 props 타입 정의
interface ReportPageProps {
  report: string;
  pageIndex: number;
}

// 이미지 페이지 컴포넌트
const ImagePage = React.forwardRef<HTMLDivElement, ImagePageProps>(
  ({ image, pageIndex }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.imagePageContent}>
        <img src={image} alt="Weekly review" className={styles.weeklyImage} />
      </div>
      <div className={styles.pageNumber}>- {pageIndex + 1} -</div>
    </div>
  )
);

// 회고 내용 페이지 컴포넌트
const ReportPage = React.forwardRef<HTMLDivElement, ReportPageProps>(
  ({ report, pageIndex }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.reportPageContent}>
        {report}
      </div>
      <div className={styles.pageNumber}>- {pageIndex + 1} -</div>
    </div>
  )
);

// 긴 내용을 페이지별로 분할하는 함수
const splitContentToPages = (content: string, maxLength: number) => {
  const pages: string[] = [];
  for (let i = 0; i < content.length; i += maxLength) {
    pages.push(content.slice(i, i + maxLength));
  }
  return pages;
};

const RemindDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state as DevelopStoryDTO;

  let currentPageIndex = 0; 

  return (
    <div className={styles.mainContainer}>
      <div className={styles.buttonBox}>
        <button className={styles.backButton} onClick={() => navigate('/remind/list')}>
          목록으로
        </button>
      </div>
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
          <Cover project={project} pageIndex={currentPageIndex++}/>
          {project.weeklyRemind.flatMap((data, index) => {
            const imagePage = <ImagePage key={`image-${currentPageIndex}`} image={data.imageUrl} pageIndex={currentPageIndex++}/>;
            const reportPages = splitContentToPages(data.content, 700).map((pageContent) => (
              <ReportPage key={`report-${index}-${currentPageIndex}`} report={pageContent} pageIndex={currentPageIndex++}/>
            ));
            return [imagePage, ...reportPages];
          })}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default RemindDetailPage;
