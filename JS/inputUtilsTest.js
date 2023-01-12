import { formatSelectOptions, getSelectOptions } from '../inputUtils';
import { offerings, promotions } from '../testsupport';

jest.unmock('../inputUtils');

describe('getSelectOptions', () => {
  it('should return the correct select options for sellable items', () => {
    const options = getSelectOptions(offerings);
    const expectedOptions = [
      {
        value: '10',
        label: 'Pass 1',
      },
      {
        value: '11',
        label: 'Pass 2',
      },
    ];

    expect(options).toEqual(expectedOptions);
  });
});

describe('formatSelectOptions', () => {
  it('should return the correct select options for discounts', () => {
    const options = formatSelectOptions(promotions);
    const expectedOptions = [
      {
        label: 'GPromo',
        value: '1',
      },
      {
        label: 'BPromo',
        value: '2',
      },
    ];

    expect(options).toEqual(expectedOptions);
  });

  it('should return an empty array if given invalid input', () => {
    expect(formatSelectOptions()).toEqual([]);
    expect(formatSelectOptions({})).toEqual([]);
    expect(formatSelectOptions({ cats: 'catsound' })).toEqual([]);
    expect(formatSelectOptions({ cats: ['luna', 'joe'] })).toEqual([]);
    expect(formatSelectOptions(null, [])).toEqual([]);
    expect(formatSelectOptions(null, ['blue', 'yellow'])).toEqual([]);
  });
});
