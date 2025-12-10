import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute'

// Mock the useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}))

const TestComponent = () => <div>Protected Content</div>

const renderWithRouter = (isAuthenticated, loading = false) => {
  mockUseAuth.mockReturnValue({
    isAuthenticated,
    loading
  })

  return render(
    <BrowserRouter>
      <PrivateRoute>
        <TestComponent />
      </PrivateRoute>
    </BrowserRouter>
  )
}

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when authenticated', () => {
    renderWithRouter(true, false)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('shows loading when loading', () => {
    renderWithRouter(false, true)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    renderWithRouter(false, false)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})

