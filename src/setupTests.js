// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import './i18n';

// react-router v7 expects Web Encoding APIs (missing in jsdom)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
