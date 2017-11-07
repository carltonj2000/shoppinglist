
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

const mainMenuTemplate = [{
  label: 'File',
  submenu: [{
      label: 'Add Item',
      click() {createAddWindow()},
    accelerator: process.platform === 'darwin' ? 'Command+E' : 'Ctrl+E',
    }, {
      label: 'Clear Items',
      accelerator: process.platform === 'darwin' ? 'Command+X' : 'Ctrl+X',
      click() {mainWindow.webContents.send('item:clear')},
    }, {
      label: 'Quit',
      click() {app.quit()},
      accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
  }],
}];

if(process.platform === 'darwin') mainMenuTemplate.unshift({}); // for mac add empty object to Menu
if(process.env.NODE_ENV !== 'production')
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [{
        label: 'Toggle Dev Tools',
        click(item, focusedWindow) {focusedWindow.toggleDevTools()},
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
      }, {
        role: 'reload'
    }]
  });

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    parent: mainWindow,
    width: 300,
    height: 200,
    title: 'Add Shopping List Item'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true,
  }));
  addWindow.on('close', () => addWindow = null);
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true,
  }));
  mainWindow.on('close', () => app.quit());
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
})

ipcMain.on('item:add', (e, item) => {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
})
