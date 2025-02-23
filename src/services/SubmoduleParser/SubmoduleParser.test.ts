import { errors, ErrorsManager } from '../ErrorManager/ErrorManager';
import { ISubmoduleParser, SubmoduleParser } from './SubmoduleParser';

describe('SubmoduleParser', () => {
  const errorManager = new ErrorsManager();
  let submoduleParser: ISubmoduleParser;

  beforeEach(() => {
    submoduleParser = new SubmoduleParser(errorManager, new RegExp(/\[.*?\]/));

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('Should get correct array from string with spaces', () => {
    const submodulesConfigString = `--branch "1.24.4.2" --subsystem '
    [
      {"jarName":"firstName.jar", "branch":"1"},
      {"jarName":"secondName.jar", "branch":"2"},
    ]'
    `;

    const result = submoduleParser.getSubmodulesArray(submodulesConfigString);

    expect(result).toEqual([
      { jarName: 'firstName.jar', branch: '1' },
      { jarName: 'secondName.jar', branch: '2' },
    ]);
  });

  it('Should get correct array from string without spaces', () => {
    const submodulesConfigString = `--branch "1.24.4.2" --subsystem '[{"jarName":"firstName.jar", "branch":"1"},{"jarName":"secondName.jar", "branch":"2"}]'`;

    const result = submoduleParser.getSubmodulesArray(submodulesConfigString);

    expect(result).toEqual([
      { jarName: 'firstName.jar', branch: '1' },
      { jarName: 'secondName.jar', branch: '2' },
    ]);
  });

  it('Should throw error not found array', () => {
    const error = errorManager.errors.notFoundSubmodulesArray;
    const submodulesConfigString = `--branch "1.24.4.2" --subsystem`;

    expect(() =>
      submoduleParser.getSubmodulesArray(submodulesConfigString)
    ).toThrow(new Error(error));

    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('Should get empty array', () => {
    const submodulesConfigString = `--branch "1.24.4.2" --subsystem '[]'`;

    const result = submoduleParser.getSubmodulesArray(submodulesConfigString);

    expect(result).toEqual([]);
  });
});
