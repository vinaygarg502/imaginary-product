import { Outlet, useLocation } from 'react-router-dom';
import AssessmentProgressIndicator, { useAssessmentProgress } from '@/components/ui/AssessmentProgress';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import Header from '@/components/ui/Header';
import {ErrorBoundaryStatusIndicator} from '@/components/ui/ErrorBoundaryStatus'

const AppLayout = () => {
const {progress} = useAssessmentProgress();
const location = useLocation();
const hasErrors = progress[location.pathname] || false;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PerformanceMonitor />
      <AssessmentProgressIndicator />
      <ErrorBoundaryStatusIndicator hasActiveErrors={hasErrors} />
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
        
    </div>
  );
};

export default AppLayout