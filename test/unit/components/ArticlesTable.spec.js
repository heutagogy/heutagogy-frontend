import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Immutable from 'immutable';
import sinon from 'sinon';
import { ArticlesTable } from './../../../src/components/ArticlesTable/ArticlesTable';
import { ZERO } from './../../../src/constants/Constants';

describe('Articles table tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Should show the date for the 'read' menu item if article is read", () => {
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: '2016-01-01T12:00:00',
      },
    ];
    const wrapper = shallow(
      <ArticlesTable
        articles={Immutable.fromJS(data)}
        selectedRows={[]}
      />
    );

    wrapper.find('.icon-menu').simulate('click');

    expect(wrapper.find('.read-article').text()).to.contain('Read: Jan 1, 2016');
  });

  it("Call update article by clicking on 'read' menu item when article isn't read", () => {
    const updateArticle = sandbox.spy();
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: null,
      },
    ];
    const wrapper = shallow(
      <ArticlesTable
        articles={Immutable.fromJS(data)}
        selectedRows={[]}
        updateArticle={updateArticle}
      />
    );

    wrapper.find('.icon-menu').simulate('click');
    wrapper.find('.read-article').simulate('check');

    expect(updateArticle.calledOnce).to.equal(true);

    const actualTimestamp = moment(updateArticle.getCall(ZERO).args[1].read);
    const now = moment();

    expect(moment(actualTimestamp).isSameOrBefore(now)).to.equal(true);
  });
});
