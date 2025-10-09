/**
 * Tests simples pour valider la configuration Jest
 */

describe('Configuration Jest', () => {
  test('Jest fonctionne correctement', () => {
    expect(true).toBe(true);
  });

  test('Math operations work', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
  });

  test('String operations work', () => {
    expect('Hello'.toUpperCase()).toBe('HELLO');
    expect('WORLD'.toLowerCase()).toBe('world');
  });
});

describe('DOM Basic Tests', () => {
  test('document exists', () => {
    expect(document).toBeDefined();
  });

  test('can create element', () => {
    const div = document.createElement('div');
    expect(div.tagName).toBe('DIV');
  });
});