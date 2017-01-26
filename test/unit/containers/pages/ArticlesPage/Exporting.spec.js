import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ArticlesPage } from './../../../../../src/containers/pages/ArticlesPage/ArticlesPage';
import { ZERO, ONE } from './../../../../../src/constants/Constants';

const exportButtonSelector = '#export-button';
const meta = 'data:text/plain;charset=utf-8,';

const noop = () => null;

describe('Exporting tests', () => {
  let sandbox; //eslint-disable-line

  beforeEach(() => {
    sandbox = sinon.sandbox.create(); //eslint-disable-line
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('"Export" button is enabled', () => {
    const wrapper = shallow(
      <ArticlesPage
        articles={Immutable.fromJS([])}
        loadEntities={noop}
      />
    );

    expect(wrapper.find(exportButtonSelector).prop('disabled')).to.equal(false);
  });

  it('Table is empty by default', () => {
    const wrapper = shallow(
      <ArticlesPage
        articles={Immutable.fromJS([])}
        loadEntities={noop}
      />
    );

    expect(wrapper.find('td')).to.have.length(ZERO);
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
      },
    ];

    const wrapper = shallow(
      <ArticlesPage
        articles={Immutable.fromJS(data)}
        loadEntities={noop}
      />
    );


    wrapper.setState({ selectedRows: [ONE] });

    wrapper.find(exportButtonSelector).simulate('click');

    expect(setAttributeSpy.getCall(ZERO).args).to.deep.equal([
      'href',
      `${meta}${encodeURIComponent(JSON.stringify([data[ONE]]))}`,
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
      },
    ];

    const wrapper = shallow(
      <ArticlesPage
        articles={Immutable.fromJS(data)}
        loadEntities={noop}
      />);

    wrapper.setState({ selectedRows: 'all' });

    wrapper.find(exportButtonSelector).simulate('click');

    expect(setAttributeSpy.getCall(ZERO).args).to.deep.equal([
      'href',
      `${meta}${encodeURIComponent(JSON.stringify(data))}`,
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
      },
    ];

    const wrapper = shallow(
      <ArticlesPage
        articles={Immutable.fromJS(data)}
        loadEntities={noop}
      />
    );

    wrapper.setState({ selectedRows: [] });

    wrapper.find(exportButtonSelector).simulate('click');

    expect(setAttributeSpy.called).to.equal(false);
    expect(clickSpy.called).to.equal(false);
  });
});
