import { ISubmoduleElem } from '../interfaces/index';
import { IErrorManager } from '../services/ErrorManager/ErrorManager';
import { ISubmoduleParser } from '../services/SubmoduleParser/SubmoduleParser';
import { ISubmoduleUpdater } from '../services/SubmoduleUpdater/SubmoduleUpdater';

export interface ISubmoduleManager {
  processSubmodules(userConfig: string, submodulesString: string): void;
}

export class SubmoduleManager implements ISubmoduleManager {
  private subsystemsKey = 'subsystems';

  constructor(
    private errorManager: IErrorManager,
    private submoduleParser: ISubmoduleParser,
    private submoduleUpdater: ISubmoduleUpdater
  ) {}

  public processSubmodules(
    userConfig: string,
    submoduleVersionsString: string
  ) {
    const submoduleVersions = this.mapSubmoduleVersionsStringToMapList(
      submoduleVersionsString
    );
    const submodulesArray = this.submoduleParser.getSubmodulesArray(userConfig);
    const updatedSubmodulesArray = submodulesArray.map((module) =>
      this.fillCorrectVersion(module, submoduleVersions)
    );
    const subsystemVersion = submoduleVersions.get(this.subsystemsKey) ?? '';

    return this.submoduleUpdater.updateSubmodulesString(
      userConfig,
      updatedSubmodulesArray,
      subsystemVersion
    );
  }

  private mapSubmoduleVersionsStringToMapList(
    submoduleVersionsString: string
  ): Map<string, string> {
    try {
      const submodulesStringList = submoduleVersionsString.trim().split('\n');

      const submodulesList = submodulesStringList.map((line) => {
        const submoduleInfo = line.split(':').map((value) => value.trim());

        if (submoduleInfo.length !== 2) {
          this.errorManager.executeError(
            this.errorManager.errors.submoduleInfoLength
          );
        }

        return submoduleInfo.map((value) => value.trim()) as [string, string];
      });

      return new Map(submodulesList);
    } catch (e) {
      this.errorManager.executeError(
        `${this.errorManager.errors.incorrectSubmodules}: ${e}`
      );
    }
  }

  private fillCorrectVersion(
    module: ISubmoduleElem,
    submoduleVersions: Map<string, string>
  ): ISubmoduleElem {
    const { jarName } = module;

    const moduleName = jarName.split('.')[0];
    const updatedVersion = submoduleVersions.get(moduleName);

    if (moduleName && updatedVersion) {
      return {
        ...module,
        branch: updatedVersion,
      };
    }

    return module;
  }
}
