import { Router } from '@/lib/router'
import { AppRoutes } from './routes'

export function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}
