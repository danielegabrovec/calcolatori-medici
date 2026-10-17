const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    title: 'MedCalc Suite - Daniele Gabrovec',
    width: 1200,
    height: 850,
    minWidth: 850,
    minHeight: 600,
    show: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const indexPath = path.join(__dirname, 'App', 'Home', 'index.html');
  win.loadFile(indexPath);

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
