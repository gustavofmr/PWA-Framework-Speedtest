import { render } from '@testing-library/react';

import Speedtest from './speedtest';

describe('Speedtest', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Speedtest />);
    expect(baseElement).toBeTruthy();
  });
});
