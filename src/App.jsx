import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import TeamDetailPage from './pages/TeamDetailPage.jsx'
import EditTeamPage from './pages/EditTeamPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/team/:teamName" element={<TeamDetailPage />} />
        <Route path="/edit/:teamName" element={<EditTeamPage />} />
        <Route path="/edit" element={<EditTeamPage />} />
      </Route>
    </Routes>
  )
}
