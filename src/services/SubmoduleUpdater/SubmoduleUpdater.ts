import { ISubmoduleElem } from '../../interfaces';

export interface ISubmoduleUpdater {
  updateSubmodulesString(
    originSubmodulesString: string,
    updatedArray: ISubmoduleElem[],
    subsystemVersion: string | undefined
  ): string;
}

export class SubmoduleUpdater implements ISubmoduleUpdater {
  private subsystemRegExp = new RegExp(/--branch "?(.+?)"? /);

  constructor(private modulesArrayRegExp: RegExp) {}

  public updateSubmodulesString(
    submodulesString: string,
    submodulesArray: ISubmoduleElem[],
    subsystemVersion: string
  ): string {
    const stringFromArray = this.formatArrayToString(submodulesArray);

    const replacedSubsystemString = submodulesString.replace(
      this.subsystemRegExp,
      ['--branch "', subsystemVersion, '" '].join('')
    );

    const withoutArrayLineBrakesString = this.removeArrayLineBrakes(
      replacedSubsystemString
    );
    return withoutArrayLineBrakesString.replace(
      this.modulesArrayRegExp,
      stringFromArray
    );
  }

  private removeArrayLineBrakes(input: string): string {
    const arrayMatch = input.match(/('.*?\[[\s\S]*?\].*?')/s);

    if (arrayMatch) {
      const arrayContent = arrayMatch[1];
      const trimmedArrayContent = arrayContent.replace(/\s+/g, '');

      const output = input.replace(arrayMatch[0], trimmedArrayContent);
      return output;
    } else {
      return input;
    }
  }

  private formatArrayToString(settings: ISubmoduleElem[]): string {
    const settingsString = JSON.stringify(settings);

    return settingsString
      .replace(/\[\{/, '[\n{') // add opening break line
      .replace(/},/g, '},\n') // add break lines between items
      .replace(/}\]/, '}\n]') // add closing break line
      .replace(/(\",)/g, `$1 `); // add space after comma in items
  }
}
