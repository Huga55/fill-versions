import { modulesArrayRegExp } from '../../core/MainApp';
import { ISubmoduleElem } from '../../interfaces';
import { ISubmoduleUpdater } from './SubmoduleUpdater';
import { SubmoduleUpdater } from './SubmoduleUpdater';

describe('SubmoduleUpdater', () => {
  let submoduleUpdater: ISubmoduleUpdater;

  beforeEach(() => {
    submoduleUpdater = new SubmoduleUpdater(modulesArrayRegExp);
  });

  it('Should return correct updated config', () => {
    const usersConfig = `/d/path --docker --branch "1.1.1.1" --subsystem ' 
    [
     {"jarName":"first.jar","git":".git","branch":"1.1.1"},
     {"jarName":"second.jar","git":".git","branch":"2.2.2"}, 
    ]'`;
    const submodules: ISubmoduleElem[] = [
      { jarName: 'first.jar', git: '.git', branch: '1.1.2' },
      { jarName: 'second.jar', git: '.git', branch: '2.2.3' },
    ];
    const systemVersion = '1.2.3';

    const result = submoduleUpdater.updateSubmodulesString(
      usersConfig,
      submodules,
      systemVersion
    );

    const expected = `/d/path --docker --branch "${systemVersion}" --subsystem '[
{"jarName":"first.jar", "git":".git", "branch":"1.1.2"},
{"jarName":"second.jar", "git":".git", "branch":"2.2.3"}
]'`;

    expect(result).toBe(expected);
  });

  it('Should return correct updated config where submodules are without spaces', () => {
    const usersConfig = `/d/path --docker --branch "1.1.1.1" --subsystem ' [{"jarName":"first.jar","git":".git","branch":"1.1.1"}]'`;
    const submodules: ISubmoduleElem[] = [
      { jarName: 'first.jar', git: '.git', branch: '1.1.2' },
    ];
    const systemVersion = '1.2.3';

    const result = submoduleUpdater.updateSubmodulesString(
      usersConfig,
      submodules,
      systemVersion
    );

    const expected = `/d/path --docker --branch "${systemVersion}" --subsystem '[
{"jarName":"first.jar", "git":".git", "branch":"1.1.2"}
]'`;

    expect(result).toBe(expected);
  });

  it('Should return unchanged string because array is not found', () => {
    const usersConfig = `/d/path --docker --branch "1.1.1.1" --subsystem 'No array here'`;
    const submodules: ISubmoduleElem[] = [];
    const systemVersion = '1.2.3';

    const result = submoduleUpdater.updateSubmodulesString(
      usersConfig,
      submodules,
      systemVersion
    );

    expect(result).toBe(
      `/d/path --docker --branch "${systemVersion}" --subsystem 'No array here'`
    );
  });

  it('Should handle empty submodules array', () => {
    const usersConfig = `/d/path --docker --branch "1.1.1.1" --subsystem '[]'`;
    const submodules: ISubmoduleElem[] = [];
    const systemVersion = '1.2.3';

    const result = submoduleUpdater.updateSubmodulesString(
      usersConfig,
      submodules,
      systemVersion
    );

    expect(result).toBe(
      `/d/path --docker --branch "${systemVersion}" --subsystem '[]'`
    );
  });

  it('Should correctly handle different line spaces', () => {
    const usersConfig = `/d/path --docker --branch "1.1.1.1" --subsystem '    
    
    
    [
          {"jarName":"first.jar",    "git":".git","branch":"1.1.1"},


     {"jarName":"second.jar","git":".git",        "branch":"2.2.2"}, 
    
     ]   '`;
    const submodules: ISubmoduleElem[] = [
      { jarName: 'first.jar', git: '.git', branch: '1.1.2' },
      { jarName: 'second.jar', git: '.git', branch: '2.2.3' },
    ];
    const systemVersion = '1.2.3';

    const result = submoduleUpdater.updateSubmodulesString(
      usersConfig,
      submodules,
      systemVersion
    );

    const expected = `/d/path --docker --branch "${systemVersion}" --subsystem '[
{"jarName":"first.jar", "git":".git", "branch":"1.1.2"},
{"jarName":"second.jar", "git":".git", "branch":"2.2.3"}
]'`;

    expect(result).toBe(expected);
  });

  it('Should handle empty system version', () => {
    const usersConfig = `/d/path --docker --branch "1.1.1.1" --subsystem '[]'`;
    const systemVersion = '';

    const result = submoduleUpdater.updateSubmodulesString(
      usersConfig,
      [],
      systemVersion
    );

    const expected = `/d/path --docker --branch "" --subsystem '[]'`;

    expect(result).toBe(expected);
  });
});
