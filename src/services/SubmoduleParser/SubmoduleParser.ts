import { ISubmoduleElem } from '../../interfaces/index';
import { IErrorManager } from '../ErrorManager/ErrorManager';

export interface ISubmoduleParser {
  getSubmodulesArray(inputString: string): ISubmoduleElem[];
}

export class SubmoduleParser implements ISubmoduleParser {
  constructor(
    private errorManager: IErrorManager,
    private modulesArrayRegExp: RegExp
  ) {}

  public getSubmodulesArray(inputString: string): ISubmoduleElem[] {
    try {
      const preparedString = this.removeSpacesFromString(inputString);
      const match = preparedString.match(this.modulesArrayRegExp);

      if (!match) {
        this.throwError();
      }

      const correctJSONArray = this.removeTrailingComma(match[0]);

      return JSON.parse(correctJSONArray);
    } catch (e) {
      this.throwError();
    }
  }

  private removeSpacesFromString(str: string) {
    return str.replace(/\s+/g, '');
  }

  private removeTrailingComma(str: string) {
    return str.replace(/,\s*(\])/, '$1');
  }

  private throwError(): never {
    this.errorManager.executeError(
      this.errorManager.errors.notFoundSubmodulesArray
    );
  }
}
