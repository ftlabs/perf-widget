/* global browser */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Website', () => {
	it('has "Hello World" in the DOM', function () {
		const text = browser
			.url('/')
			.waitForText('main')
			.getText('main');

		expect(text).to.eventually.include('Hello World');
	});
});
