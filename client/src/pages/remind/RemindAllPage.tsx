import React, { useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './RemindAllPage.module.css';
import remindBG from '../../assets/remind/remindBG.png';
import useUserStore from '@/stores/useUserStore';
import { useDevelopStory } from '@/features/remind/hooks/useDevelopStory';
import { DevelopStoryDTO } from '@features/remind/types/DevelopStoryDTO';

interface CoverProps {
  project: DevelopStoryDTO;
}

const Cover = React.forwardRef<HTMLDivElement, CoverProps>(
  ({ project }, ref) => (
    <div className={styles.cover} ref={ref}>
      <div className={styles.coverContent}>
        <h1 className={styles.projectName}>{project.projectName}</h1>
        <p className={styles.projectDate}>{project.projectStartDate} ~ {project.projectEndDate}</p>
      </div>
    </div>
  )
);

interface ImagePageProps {
  image: string;
}

const ImagePage = React.forwardRef<HTMLDivElement, ImagePageProps>(
  ({ image }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.imagePageContent}>
        <img src={image} alt="Weekly review" className={styles.weeklyImage} />
      </div>
    </div>
  )
);

interface ReportPageProps {
  report: string;
}

const ReportPage = React.forwardRef<HTMLDivElement, ReportPageProps>(
  ({ report }, ref) => (
    <div className={styles.page} ref={ref}>
      <div className={styles.reportPageContent}>
        {report}
      </div>
    </div>
  )
);

const splitContentToPages = (content: string, maxLength: number) => {
  const pages: string[] = [];
  for (let i = 0; i < content.length; i += maxLength) {
    pages.push(content.slice(i, i + maxLength));
  }
  return pages;
};

const RemindAllPage: React.FC = () => {
  const { userId } = useUserStore();
  const { data } = useDevelopStory({ userId: userId ?? 0 });

  useEffect(() => {
    if (data) {
      console.log('Develop story data:', data);
    }
  }, [data]);

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
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={0}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {data?.flatMap((project) => [
            <Cover key={`cover-${project.projectId}`} project={project} />,
            ...project.weeklyRemind.flatMap((remind, index) => [
              remind.imageUrl && <ImagePage key={`image-${project.projectId}-${index}`} image={remind.imageUrl} />,
              ...splitContentToPages(remind.content, 750).map((pageContent, pageIndex) => (
                <ReportPage key={`report-${project.projectId}-${index}-${pageIndex}`} report={pageContent} />
              ))
            ]).filter(Boolean)
          ])}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default RemindAllPage;
