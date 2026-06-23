import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import CveExplorerPage from './pages/CveExplorerPage';
import CveDetailPage from './pages/CveDetailPage';
import AnalysisPage from './pages/AnalysisPage';
import ModelsPage from './pages/ModelsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="/cve-explorer" element={<CveExplorerPage />} />
          <Route path="/cve-explorer/:id" element={<CveDetailPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}