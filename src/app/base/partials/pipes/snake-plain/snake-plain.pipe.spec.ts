import { SnakeToPlainPipe } from './snake-plain.pipe';

describe('SnakePlainPipe', () => {
    it('create an instance', () => {
        const pipe = new SnakeToPlainPipe();
        expect(pipe).toBeTruthy();
    });
});
