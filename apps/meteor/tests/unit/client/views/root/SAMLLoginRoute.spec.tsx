import { MockedServerContext, MockedUserContext } from '@rocket.chat/mock-providers';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Meteor } from 'meteor/meteor';
import React from 'react';

import SAMLLoginRoute from '../../../../../client/views/root/SAMLLoginRoute';
import RouterContextMock from '../../../../mocks/client/RouterContextMock';

const navigateStub = jest.fn();

describe('views/root/SAMLLoginRoute', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		navigateStub.mockClear();
		(Meteor.loginWithSamlToken as jest.Mock<any>).mockClear();
	});

	it('should redirect to /home', async () => {
		render(
			<MockedServerContext>
				<MockedUserContext>
					<RouterContextMock searchParameters={{ redirectUrl: 'http://rocket.chat' }} navigate={navigateStub}>
						<SAMLLoginRoute />
					</RouterContextMock>
				</MockedUserContext>
			</MockedServerContext>,
		);

		expect(navigateStub).toHaveBeenCalledTimes(1);
		expect(navigateStub).toHaveBeenLastCalledWith(expect.objectContaining({ pathname: '/home' }), expect.anything());
	});

	it('should redirect to /home when redirectUrl is not within the workspace domain', async () => {
		render(
			<MockedServerContext>
				<RouterContextMock searchParameters={{ redirectUrl: 'http://rocket.chat' }} navigate={navigateStub}>
					<SAMLLoginRoute />
				</RouterContextMock>
			</MockedServerContext>,
		);

		expect(navigateStub).toHaveBeenCalledTimes(1);
		expect(navigateStub).toHaveBeenLastCalledWith(expect.objectContaining({ pathname: '/home' }), expect.anything());
	});

	it('should redirect to the provided redirectUrl when redirectUrl is within the workspace domain', async () => {
		render(
			<MockedServerContext>
				<RouterContextMock searchParameters={{ redirectUrl: 'http://localhost:3000/invite/test' }} navigate={navigateStub}>
					<SAMLLoginRoute />
				</RouterContextMock>
			</MockedServerContext>,
		);

		expect(navigateStub).toHaveBeenCalledTimes(1);
		expect(navigateStub).toHaveBeenLastCalledWith(expect.objectContaining({ pathname: '/invite/test' }), expect.anything());
	});

	it('should call loginWithSamlToken when component is mounted', async () => {
		render(
			<MockedServerContext>
				<RouterContextMock searchParameters={{ redirectUrl: 'http://rocket.chat' }} navigate={navigateStub}>
					<SAMLLoginRoute />
				</RouterContextMock>
			</MockedServerContext>,
		);

		expect(Meteor.loginWithSamlToken).toHaveBeenCalledTimes(1);
		expect(Meteor.loginWithSamlToken).toHaveBeenLastCalledWith(undefined, expect.any(Function));
	});

	it('should call loginWithSamlToken with the token when it is present', async () => {
		render(
			<MockedUserContext>
				<RouterContextMock
					searchParameters={{ redirectUrl: 'http://rocket.chat' }}
					routeParameters={{ token: 'testToken' }}
					navigate={navigateStub}
				>
					<SAMLLoginRoute />
				</RouterContextMock>
			</MockedUserContext>,
		);

		expect(Meteor.loginWithSamlToken).toHaveBeenCalledTimes(1);
		expect(Meteor.loginWithSamlToken).toHaveBeenLastCalledWith('testToken', expect.any(Function));
	});
});
