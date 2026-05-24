import { Route, Switch } from 'wouter'
import { AdminDashboard } from './components/AdminDashboard'
import { AuthPage } from './components/AuthPage'
import { CartPage } from './components/CartPage'
import { FeedbackPage } from './components/FeedbackPage'
import { HomePage } from './components/HomePage'
import { Navigation } from './components/Navigation'
import { ProductDetailPage } from './components/ProductDetailPage'
import { ProductsPage } from './components/ProductsPage'
import { RemediesPage } from './components/RemediesPage'
import { SellerDashboard } from './components/SellerDashboard'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/products/:id" component={ProductDetailPage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/remedies" component={RemediesPage} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/seller" component={SellerDashboard} />
            <Route path="/feedback" component={FeedbackPage} />
            <Route component={HomePage} />
          </Switch>
        </main>
      </div>
    </CartProvider>
  )
}
