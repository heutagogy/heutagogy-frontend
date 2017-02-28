/* eslint-disable fp/no-mutation */

import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ExportModal } from './../../../src/components/ExportModal/ExportModal';
import { ZERO, ONE, TWO } from './../../../src/constants/Constants';


const mockLoadEntities = () => ({ then: () => null });
const meta = 'data:text/plain;charset=utf-8,';

describe('Export modal tests', () => {
  let sandbox; //eslint-disable-line

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should save selected articles', () => {
    const setAttributeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();

    sandbox.stub(document, 'createElement').withArgs('a').returns({
      setAttribute: setAttributeSpy,
      dispatchEvent: clickSpy,
    });

    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-02T05:06:08',
        read: '2016-01-03T05:06:08',
      },
      {
        url: 'https://www.google.com.ua',
        title: 'Google',
      },
    ];

    const wrapper = shallow(
      <ExportModal
        articles={Immutable.fromJS(data)}
        loadEntities={mockLoadEntities}
      />
    );

    wrapper.setState({ selectedRows: [ONE] });

    wrapper.instance().handleSubmit();

    expect(setAttributeSpy.getCall(ZERO).args).to.deep.equal([
      'href',
      `${meta}${encodeURIComponent(JSON.stringify([data[ONE]], null, TWO))}`,
    ]);
    expect(clickSpy.called).to.equal(true);
  });

  it('Should save all articles if all articles are selecteled', () => {
    const setAttributeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();

    sandbox.stub(document, 'createElement').withArgs('a').returns({
      setAttribute: setAttributeSpy,
      dispatchEvent: clickSpy,
    });

    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-02T05:06:08',
        read: '2016-01-02T09:06:08',
      },
      {
        url: 'https://www.google.com.ua',
        title: 'Google',
      },
    ];

    const wrapper = shallow(
      <ExportModal
        articles={Immutable.fromJS(data)}
        loadEntities={mockLoadEntities}
      />);

    wrapper.setState({ selectedRows: 'all' });

    wrapper.instance().handleSubmit();

    expect(setAttributeSpy.getCall(ZERO).args).to.deep.equal([
      'href',
      `${meta}${encodeURIComponent(JSON.stringify(data, null, TWO))}`,
    ]);
    expect(clickSpy.called).to.equal(true);
  });

  it('Shouldn\'t save articles if there are no selected articles', () => {
    const setAttributeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();

    sandbox.stub(document, 'createElement').withArgs('a').returns({
      setAttribute: setAttributeSpy,
      dispatchEvent: clickSpy,
    });

    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-02T05:06:08',
        read: '2016-01-03T05:06:08',
      },
      {
        url: 'https://www.google.com.ua',
        title: 'Google',
      },
    ];

    const wrapper = shallow(
      <ExportModal
        articles={Immutable.fromJS(data)}
        loadEntities={mockLoadEntities}
      />
    );

    wrapper.setState({ selectedRows: [] });

    wrapper.instance().handleSubmit();

    expect(setAttributeSpy.called).to.equal(false);
    expect(clickSpy.called).to.equal(false);
  });
});
