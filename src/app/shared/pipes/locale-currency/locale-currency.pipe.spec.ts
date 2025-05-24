import { LocaleCurrencyPipe } from './locale-currency.pipe';

describe('LocaleCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new LocaleCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
