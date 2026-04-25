import ReactGA from "react-ga4";
// Import the createRoot function from react-dom/client
import { createRoot } from 'react-dom/client'
// Import the main stylesheet
import './index.css'
// Import the root component of the application
import App from './App.jsx'
import { HelmetProvider } from "react-helmet-async";

ReactGA.initialize("G-P7LPS5CSLP");

// Removed StrictMode to reduce TBT (causes double rendering)
// Only use StrictMode in development if needed for debugging
// Create a root element and render the App component into it
createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)

// Add this code to handle the PWA install prompt
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default mini-infobar from appearing
  event.preventDefault();

  // Save the event for triggering later
  let deferredPrompt = event;

  // Create a pop-up element
  const installPopup = document.createElement('div');
  installPopup.style.position = 'fixed';
  installPopup.style.bottom = '20px';
  installPopup.style.right = '20px';
  installPopup.style.padding = '10px 20px';
  installPopup.style.backgroundColor = 'brown';
  installPopup.style.color = '#fff';
  installPopup.style.borderRadius = '5px';
  installPopup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  installPopup.style.cursor = 'pointer';
  installPopup.textContent = 'Install this app';
  installPopup.style.zIndex = '9999';

  // Append the pop-up to the body
  document.body.appendChild(installPopup);

  // Handle click on the pop-up
  installPopup.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clear the deferred prompt
      deferredPrompt = null;
    });

    // Remove the pop-up after interaction
    document.body.removeChild(installPopup);
  });
});

// Safari detection for PWA installation instructions
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

// Only show Safari popup if:
// 1. Browser is Safari
// 2. App is not in standalone mode
// 3. User hasn’t dismissed it before
if (isSafari() && !isInStandaloneMode() && !localStorage.getItem('safariInstalled')) {
  const safariPopup = document.createElement('div');

  safariPopup.style.position = 'fixed';
  safariPopup.style.bottom = '20px';
  safariPopup.style.right = '20px';
  safariPopup.style.width = '220px';
  safariPopup.style.padding = '10px 15px';
  safariPopup.style.backgroundColor = 'brown';
  safariPopup.style.color = '#fff';
  safariPopup.style.borderRadius = '5px';
  safariPopup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
  safariPopup.style.cursor = 'pointer';
  safariPopup.style.fontSize = '14px';
  safariPopup.style.lineHeight = '1.4';
  safariPopup.style.textAlign = 'left';
  safariPopup.style.whiteSpace = 'normal';
  safariPopup.style.wordWrap = 'break-word';
  safariPopup.style.zIndex = '9999'; // <- ensures it stays on top

  safariPopup.textContent = 'To install this app, tap Share → More → Add to Home Screen';

  safariPopup.addEventListener('click', () => {
    document.body.removeChild(safariPopup);
    localStorage.setItem('safariInstalled', 'true');
  });

  document.body.appendChild(safariPopup);

  setTimeout(() => {
    if (document.body.contains(safariPopup)) {
      document.body.removeChild(safariPopup);
    }
  }, 8000);
}
