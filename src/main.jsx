import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Spotlight} from "@/components/ui/spotlight.jsx";
import GridBackground from "@/components/ui/GridBackground.jsx";
import {ThemeProvider} from "@/lib/theme-provider.jsx";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "@/context/UserContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <UserProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <App />
          </ThemeProvider>
      </UserProvider>
  </BrowserRouter>,
)
