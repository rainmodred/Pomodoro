// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest
  .spyOn(window.HTMLMediaElement.prototype, 'pause')
  .mockImplementation(() => {});

//beforeALl not working
global.beforeEach(() => {
  global.Notification = {
    requestPermission: jest.fn().mockResolvedValue('denied'),
    permission: 'granted',
  } as unknown as jest.Mocked<typeof Notification>;
});
