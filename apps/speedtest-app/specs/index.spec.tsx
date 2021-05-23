import { render } from '@testing-library/react';
import React from 'react';

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<h1>speedtest-app</h1>);
    expect(baseElement).toBeTruthy();
  });
});
