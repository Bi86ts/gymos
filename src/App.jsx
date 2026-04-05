import { Routes, Route, Navigate } from 'react-router-dom'
import AuthCallback from './pages/AuthCallback'
import RoleSelector from './pages/RoleSelector'
import LandingPage from './pages/LandingPage'
import OnboardingFlow from './pages/member/OnboardingFlow'
import MemberLayout from './layouts/MemberLayout'
import MemberHome from './pages/member/MemberHome'
import WeeklyPlan from './pages/member/WeeklyPlan'
import SkipSession from './pages/member/SkipSession'
import CheckinConfirmed from './pages/member/CheckinConfirmed'
import RecoveryPlan from './pages/member/RecoveryPlan'
import TrainerChat from './pages/member/TrainerChat'
import MessageHub from './pages/member/MessageHub'
import MemberProfile from './pages/member/MemberProfile'
import RenewalScreen from './pages/member/RenewalScreen'
import ExerciseLibrary from './pages/member/ExerciseLibrary'
import MuscleSelector from './pages/member/MuscleSelector'
import WorkoutPlanView from './pages/member/WorkoutPlanView'

import TrainerLayout from './layouts/TrainerLayout'
import ActionQueue from './pages/trainer/ActionQueue'
import MemberDirectory from './pages/trainer/MemberDirectory'
import MemberDetail from './pages/trainer/MemberDetail'
import TrainerSchedule from './pages/trainer/TrainerSchedule'
import TrainerProfile from './pages/trainer/TrainerProfile'

import OwnerLayout from './layouts/OwnerLayout'
import RetentionDashboard from './pages/owner/RetentionDashboard'
import ChurnRiskList from './pages/owner/ChurnRiskList'
import RenewalDashboard from './pages/owner/RenewalDashboard'
import RevenueDashboard from './pages/owner/RevenueDashboard'
import OffersDashboard from './pages/owner/OffersDashboard'

import TrainerMessageDashboard from './pages/trainer/TrainerMessageDashboard'
import TrainerMessageDetail from './pages/trainer/TrainerMessageDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/select-role" element={<RoleSelector />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />

      {/* Member Routes */}
      <Route path="/member" element={<MemberLayout />}>
        <Route index element={<MemberHome />} />
        <Route path="plan" element={<WeeklyPlan />} />
        <Route path="muscle-select" element={<MuscleSelector />} />
        <Route path="exercises" element={<ExerciseLibrary />} />
        <Route path="workout-plan" element={<WorkoutPlanView />} />
        <Route path="chat" element={<MessageHub />} />
        <Route path="profile" element={<MemberProfile />} />
      </Route>

      {/* Member Specific Utility */}
      <Route path="/member/chat/trainer" element={<MemberLayout />}>
        <Route index element={<TrainerChat />} />
      </Route>
      <Route path="/member/skip" element={<SkipSession />} />
      <Route path="/member/checkin" element={<CheckinConfirmed />} />
      <Route path="/member/recovery" element={<RecoveryPlan />} />
      <Route path="/member/renewal" element={<RenewalScreen />} />

      {/* Trainer Routes */}
      <Route path="/trainer" element={<TrainerLayout />}>
        <Route index element={<ActionQueue />} />
        <Route path="members" element={<MemberDirectory />} />
        <Route path="member/:id" element={<MemberDetail />} />
        <Route path="schedule" element={<TrainerSchedule />} />
        <Route path="messages" element={<TrainerMessageDashboard />} />
        <Route path="messages/:id" element={<TrainerMessageDetail />} />
        <Route path="profile" element={<TrainerProfile />} />
      </Route>

      {/* Owner Routes */}
      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<RetentionDashboard />} />
        <Route path="churn" element={<ChurnRiskList />} />
        <Route path="renewals" element={<RenewalDashboard />} />
        <Route path="revenue" element={<RevenueDashboard />} />
        <Route path="offers" element={<OffersDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
