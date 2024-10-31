// routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/mainPage/MainPage';
import ProjectListPage from '../pages/project/ProjectListPage';
import MainLayout from '../components/mainLayout/MainLayout';
import MeetingListPage from '../pages/meeting/MeetingListPage';
import RemindListPage from '../pages/remind/RemindListPage';
import MeetingCreatePage from '../pages/meeting/MeetingCreatePage';
import MyPage from '../pages/myPage/MyPage';
const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/project" element={<ProjectListPage />}></Route>
      <Route path="/meeting" element={<MeetingListPage />}></Route>
      <Route path="/meeting/create" element={<MeetingCreatePage />}></Route>
      <Route path="/remind" element={<RemindListPage />}></Route>
      <Route path="/mypage" element={<MyPage />}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
