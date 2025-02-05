import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;