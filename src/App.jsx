import { Routes, Route, Navigate } from 'react-router-dom'
import RoleSelector from './pages/RoleSelector'
import MemberLayout from './layouts/MemberLayout'
import MemberHome from './pages/member/MemberHome'
import GoalSelection from './pages/member/GoalSelection'
import FitnessLevel from './pages/member/FitnessLevel'
import ScheduleSetup from './pages/member/ScheduleSetup'
import OnboardingComplete from './pages/member/OnboardingComplete'
import WeeklyPlan from './pages/member/WeeklyPlan'
import SkipSession from './pages/member/SkipSession'
import CheckinConfirmed from './pages/member/CheckinConfirmed'
import GoalBreakdown from './pages/member/GoalBreakdown'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelector />} />
      {/* Member Routes */}
      <Route path="/member" element={<MemberLayout />}>
        <Route index element={<MemberHome />} />
        <Route path="plan" element={<WeeklyPlan />} />
        <Route path="skip" element={<SkipSession />} />
        <Route path="checkin" element={<CheckinConfirmed />} />
        <Route path="goals" element={<GoalBreakdown />} />
      </Route>
      <Route path="/member/onboarding/goals" element={<GoalSelection />} />
      <Route path="/member/onboarding/fitness" element={<FitnessLevel />} />
      <Route path="/member/onboarding/schedule" element={<ScheduleSetup />} />
      <Route path="/member/onboarding/complete" element={<OnboardingComplete />} />
      {/* Trainer Routes */}
      <Route path="/trainer" element={<TrainerLayout />}>
        <Route index element={<ActionQueue />} />
        <Route path="members" element={<MemberDirectory />} />
        <Route path="member/:id" element={<MemberDetail />} />
        <Route path="schedule" element={<TrainerSchedule />} />
        <Route path="profile" element={<TrainerProfile />} />
      </Route>
      {/* Owner Routes */}
      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<RetentionDashboard />} />
        <Route path="churn" element={<ChurnRiskList />} />
        <Route path="renewals" element={<RenewalDashboard />} />
        <Route path="revenue" element={<RevenueDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
