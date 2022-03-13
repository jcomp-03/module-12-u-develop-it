const inputCheck = require('../utils/inputCheck');

// Test #1
// the function inputCheck() will return null if
// all the properties are defined and not an empty string
test('inputCheck() returns null when all properties exist', () => {
  const obj = {name: 'alice'};

  expect(inputCheck(obj, 'name')).toBe(null);
});

// Test #2
test('inputCheck() returns an object when a property is missing', () => {
  const obj = {name: 'alice', occupation: ''};

  expect(inputCheck(obj, 'name', 'occupation')).toEqual(
    expect.objectContaining({
      error: expect.stringContaining('No occupation specified')
    })
  );
});