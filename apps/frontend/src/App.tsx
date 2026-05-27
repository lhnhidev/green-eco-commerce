import { Route, Switch } from 'wouter'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/client/HomePage'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </div>
  )
}
