import { errors, ErrorsManager, IErrorManager } from './ErrorManager';

describe('ErrorsManager', () => {
  let errorManager: IErrorManager;

  beforeEach(() => {
    errorManager = new ErrorsManager();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return the correct errors object', () => {
    const expectedErrors = errors;

    expect(errorManager.errors).toEqual(expectedErrors);
  });

  it('Should log error and throw expectation', () => {
    const error: (typeof errors)[keyof typeof errorManager.errors] =
      errors['incorrectSubmodules'];

    expect(() => errorManager.executeError(error)).toThrow(new Error(error));

    expect(console.error).toHaveBeenCalledWith(error);
  });
});
