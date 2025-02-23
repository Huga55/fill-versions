import { app, BrowserWindow, ipcMain, clipboard } from 'electron';
import path from 'path';
import { ISubmoduleManager, SubmoduleManager } from './SubmoduleManager';
import { ErrorsManager } from '../services/ErrorManager/ErrorManager';
import { SubmoduleParser } from '../services/SubmoduleParser/SubmoduleParser';
import { SubmoduleUpdater } from '../services/SubmoduleUpdater/SubmoduleUpdater';

export const modulesArrayRegExp = new RegExp(/\[.*?\]/);

export interface IMainApp {
  init(): void;
}

export class MainApp implements IMainApp {
  private submoduleManager: ISubmoduleManager;
  private modulesArrayRegExp = modulesArrayRegExp;

  constructor() {
    const errorsManager = new ErrorsManager();
    const submoduleParser = new SubmoduleParser(
      errorsManager,
      this.modulesArrayRegExp
    );
    const submoduleUpdater = new SubmoduleUpdater(this.modulesArrayRegExp);

    this.submoduleManager = new SubmoduleManager(
      errorsManager,
      submoduleParser,
      submoduleUpdater
    );
  }

  public init() {
    app.whenReady().then(async () => {
      const mainWindow = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });

      const isDev = process.env.NODE_ENV === 'development';
      const rootPath = isDev ? process.cwd() : __dirname;

      mainWindow.loadFile(path.join(rootPath, 'public', 'index.html'), {
        query: { v: String(Date.now()) },
      });

      ipcMain.on(
        'generate',
        (event, userConfig: string, submodulesList: string) => {
          try {
            const result = this.submoduleManager.processSubmodules(
              userConfig,
              submodulesList
            );
            event.reply('generated', result);
          } catch (e) {
            event.reply('error', e);
          }
        }
      );

      ipcMain.on('copy', (event, text) => {
        clipboard.writeText(text);
      });

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });
    });
  }
}
