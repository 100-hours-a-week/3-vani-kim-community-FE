// app.test.js

describe('CI/CD Pipeline Test', () => {
    test('1 + 1은 2여야 한다 (Smoke Test)', () => {
        expect(1 + 1).toBe(2);
    });

    test('항상 통과하는 테스트', () => {
        expect(true).toBe(true);
    });
});