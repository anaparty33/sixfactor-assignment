import React from 'react';
import { render, screen } from 'testUtils';
import {cloneDeep} from 'lodash';
import '@testing-library/jest-dom';
import Dashboard from './dashboard';

let startState = {
  userInfo: {
    user: {
      firstName: 'Renjit',
      lastName: 'Abraham',
      permissions: [
        'userManagment',
        'assortmentLOBManagement',
        'assetTypeManagment',
        'marketLevelCoversup'
      ],
      urls: {
        stage: 'https://wonderland-stg-dev.apple.com/home.html',
        publishInternal: 'https://wonderland-int-dev.apple.com/home.html',
        publishExternal: 'https://wonderland-dev.apple.com/home.html',
        cms: 'https://wonderlandcms-dev.apple.com/'
      }
    },
    isLoading: false
  }
}
describe('Dashboard component Testing', () => {
  describe('Dashboard component Unit Test', () => {
    it('Renders the connected app with initialState', () => {
      render(
        <Dashboard />, 
        { initialState: startState }
      );
    });
    it('Renders the dashboard heading', () => {
      render(
        <Dashboard />, 
        { initialState: startState }
      );
      expect(
        screen.getByRole('heading', { name: /Welcome to/})
      ).toBeInTheDocument();
    });
    it('Renders the dashboard container titles', () => {
      render(
        <Dashboard />, 
        { initialState: startState }
      );
      expect(
        screen.getByRole('heading', { name: 'Set Up' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Live Preview' })
      ).toBeInTheDocument();
    });
    it('Renders the dashboard cards', () => {
      render(
        <Dashboard />, 
        { initialState: startState }
      );
      expect(screen.getByRole('link', { name: 'User Management' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Assortment Manager' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Asset Type Management' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'CMS' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Cover Page Designation' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Stage Environment' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Prod Internal Environment' })).toBeInTheDocument();
    });
    it('Card link is not disabled', () => {
      render(
        <Dashboard />, 
        { initialState: startState }
      );
      expect(
        screen.getByRole('link', { name: 'User Management' })
      ).not.toBeDisabled();
    });
    it('Card link is valid', () => {
      render(
        <Dashboard />, 
        { initialState: startState }
      );
      expect(
        screen.getByRole('link', { name: 'User Management' })
      ).toHaveAttribute('href', '/manage/admin');
    });
  });

  describe('Dashboard component Functinality Test', () => {
    describe('Dashboard card Permission Functinality Test', () => {
      let cardDisabledState = cloneDeep(startState);
      it('Card which has no permission should have disabled class', () => {
        cardDisabledState.userInfo.user.permissions.shift();
        render(
          <Dashboard />, 
          { initialState: cardDisabledState }
        );
        expect(
          screen.getByRole('link', { name: 'User Management' })
        ).toHaveClass('disabled');
      });
      it('Card which has permission should not have disabled class', () => {
        render(
          <Dashboard />, 
          { initialState: cardDisabledState }
        );
        expect(
          screen.getByRole('link', { name: 'Assortment Manager' })
        ).not.toHaveClass('disabled');
      });
    });
  });
});