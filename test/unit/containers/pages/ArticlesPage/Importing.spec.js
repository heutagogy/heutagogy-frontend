/* eslint-disable fp/no-mutation */
/* eslint-disable react/jsx-max-props-per-line */

import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ArticlesPage } from './../../../../../src/containers/pages/ArticlesPage/ArticlesPage';

const noop = () => null;
const importButtonSelector = '#import-button';


describe('Import page tests', () => {
  let sandbox; //eslint-disable-line

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('"Import" button is enabled by default', () => {
    const wrapper = shallow(<ArticlesPage loadEntities={noop} user={Immutable.fromJS({})} />);

    expect(wrapper.find(importButtonSelector).prop('disabled')).to.equal(false);
  });

  it('Input file accepts only json', () => {
    const wrapper = shallow(<ArticlesPage loadEntities={noop} user={Immutable.fromJS({})} />);

    expect(wrapper.find('input[type="file"]').html()).to.contain('accept=".json"');
  });

  it('Data is set when uploading file is valid json array', () => {
    const wrapper = shallow(<ArticlesPage loadEntities={noop} user={Immutable.fromJS({})} />);
    const file = {
      name: 'valid_array.json',
      type: 'application/json',
      content: [
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
      ],
    };

    const stub = sandbox.stub(FileReader.prototype, 'readAsText', function callback() {
      this.onload({ target: { result: JSON.stringify(file.content) } });
    });

    wrapper.find('input').simulate('change', { target: { files: [file] } });

    stub.restore();

    expect(wrapper.state().articlesToImport).to.deep.equal(Immutable.fromJS(file.content));
    expect(wrapper.state().openImport).to.equal(true);
  });
});
