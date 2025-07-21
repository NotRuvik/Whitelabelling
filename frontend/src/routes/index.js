import NpoDetailPage from '../pages/NpoDetailPage'; // Ensure correct path

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />
  },
  {
    path: '/npos',
    element: <NposPage />
  },
  {
    path: '/npos/:id', 
    element: <NpoDetailPage />
  }
]);
