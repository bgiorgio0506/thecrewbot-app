import {BrowserWindow, app, autoUpdater} from 'electron';

const server = 'https://update.electronjs.org';
const feed = `${server}/bgiorgio0506/thecrewbot-app/${process.platform}-${process.arch}/${app.getVersion()}`

const AppTraySchema = {
    ContextMenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          let win = BrowserWindow.getAllWindows()
          win[0].reload()
        }
      }, {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
      {
        label: 'Check for update',
        click: () => {
            autoUpdater.setFeedURL(feed);
            autoUpdater.checkForUpdates();
        },
      }
    ]
}

export default AppTraySchema