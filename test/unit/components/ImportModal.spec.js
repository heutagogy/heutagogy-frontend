import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ImportModal } from './../../../src/components/ImportModal/ImportModal';
import { ONE } from './../../../src/constants/Constants';

const importTableSelector = '#importing-table';
const messageSelector = '#message';


describe('Import modal tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Show message if there are no articles', () => {
    const wrapper = shallow(
      <ImportModal
        articles={Immutable.fromJS([])}
      />
    );

    expect(wrapper.find(messageSelector)).to.have.length(ONE);
  });

  it('Show import table if there are articles', () => {
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-03T05:06:09',
        read: null,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-04T05:06:10',
        read: '2016-01-05T05:06:10',
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    const wrapper = shallow(
      <ImportModal
        articles={Immutable.fromJS(data)}
      />
    );

    expect(wrapper.find(importTableSelector)).to.have.length(ONE);
  });
});
