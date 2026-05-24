import { Route, Switch } from 'wouter'
import { HomePage } from './components/HomePage'
import { Navigation } from './components/Navigation'

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
