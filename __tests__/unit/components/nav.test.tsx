import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import Nav from '@/components/Nav';
import React from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('Nav Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ query: {} });
  });
  it('Should render properly', () => {
    const setStateMock = jest.fn();
    const useStateMock: any = (initState: boolean) => [initState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    const nav = render(<Nav />);
    const navLinks = screen.getAllByRole('link');
    navLinks.forEach((link) => {
      fireEvent.click(link);
      expect(setStateMock).toHaveBeenCalledWith(false);
    });
  });
});
