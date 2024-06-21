const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let tray;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Consider enabling context isolation or preload scripts if needed.
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname,'../../public/index.html' )}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Function to start the server as a child process
function startServer() {
  // Replace 'server.js' with the actual path to your server file
serverProcess = fork(path.join(__dirname, '../../src/backend/server.js'));

  serverProcess.on('message', (message) => {
    console.log('Server process message:', message);
  });

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err);
  });

  serverProcess.on('exit', (code, signal) => {
    console.log(`Server process exited with code ${code} and signal ${signal}`);
  });
}

function quitApp() {
  // Terminate the server process if it exists
  if (serverProcess) {
    serverProcess.kill('SIGINT'); // Send signal to gracefully terminate the process
    serverProcess = null;
  }
  // Quit the Electron app
  app.quit();
}

app.on('ready', async () => {
  try {
    startServer(); // Start the server when Electron is ready
    createWindow(); // Create the Electron window after server starts
    
    // Create a tray icon
    tray = new Tray(path.join(__dirname, 'tray-icon.png'));
    
    // Create a context menu for the tray icon
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open App',
        click: () => {
          createWindow();
        }
      },
      {
        label: 'Quit',
        click: () => {
          quitApp();
        }
      }
    ]);
    
    tray.setToolTip('Leave Request App');
    tray.setContextMenu(contextMenu);
    
    // Hide the main window when all windows are closed
    app.on('window-all-closed', () => {
      if (process.platform === 'win32') {
        if (mainWindow) {
          mainWindow.hide(); // Example usage to hide mainWindow
        } else {
          console.error('Main window is null when attempting to hide it.');
        }
      }
      // You may implement additional logic for other platforms if needed
    });
    
    // Handle activation (common in macOS)
    app.on('activate', () => {
      if (!mainWindow.isVisible()) {
        createWindow();
      }
    });
  } catch (error) {
    // Handle errors when starting server
    console.error('Error starting server:', error);
    // Optionally quit the app or handle the error gracefully
    app.quit();
  }





});

// Example error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});


// src/main/index.js ------  development code
// const { app, BrowserWindow } = require('electron');
// //const path = require('path');
// const startServer = require('../backend/server'); // Start the Express server

// //app.commandLine.appendSwitch('allow-file-access-from-files');


// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true, // Enable nodeIntegration
//       contextIsolation: false, // Enable contextIsolation
//     }
//   });

//   // win.loadFile(`file://${path.join(__dirname, '../../public/index.html')}`);

//   win.loadURL(
//    'http://localhost:3000'
//   );

//   if (isDev()) {
//     win.webContents.openDevTools();
//   }
// }


// app.whenReady().then(async () => {
//     try {
//       const server = await startServer(); // Start the Express server
//       console.log('Express server started successfully!');
  
//       createWindow(); // Create the Electron window after server starts
  
//       app.on('activate', () => {
//         if (BrowserWindow.getAllWindows().length === 0) {
//             createWindow();
//           }
//       });
//     } catch (error) {
//       console.error('Failed to start server:', error);
//       app.quit(); // Quit the Electron app if server startup fails
//     }
//   });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// // Function to check if in development mode
// function isDev() {
//     return process.env.NODE_ENV === 'development';
//   }