/* eslint-disable fp/no-mutation */

import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ImportPage } from '../../../../src/containers/pages/ImportPage/ImportPage';
import { ZERO, ONE } from '../../../../src/constants/Constants';

const noop = () => ({});
const saveButtonSelector = '#save-button';
const importButtonSelector = '#import-button';


describe('Import page tests', () => {
  let sandbox; //eslint-disable-line

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('“Save” button is disabled by default', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);

    expect(wrapper.find(saveButtonSelector).prop('disabled')).to.equal(true);
  });

  it('“Import” button is enabled by default', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);

    expect(wrapper.find(importButtonSelector).prop('disabled')).to.equal(false);
  });

  it('“Save” button is enabled when data is imported', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);

    wrapper.setState({ data: [{ url: 'https://github.com/' }] }, () => {
      expect(wrapper.find(saveButtonSelector).prop('disabled')).to.equal(false);
    });
  });

  it('Table is empty by default', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);

    expect(wrapper.find('td')).to.have.length(ZERO);
  });

  it('Input file accepts only json', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);

    expect(wrapper.find('input[type="file"]').html()).to.contain('accept=".json"');
  });

  it('Data is set when uploading file is valid json array', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);
    const file = {
      name: 'valid_array.json',
      type: 'application/json',
      content: [
        {
          url: 'http://example.com/',
          title: 'Example Domain',
          timestamp: '2016-01-01T05:06:07',
          read: 0,
        },
        {
          url: 'https://github.com/',
          title: 'How people build software',
          timestamp: '2016-01-02T05:06:08',
          read: 1,
        },
      ],
    };

    const stub = sandbox.stub(FileReader.prototype, 'readAsText', function callback() {
      this.onload({ target: { result: JSON.stringify(file.content) } });
    });

    wrapper.find('input').simulate('change', { target: { files: [file] } });

    stub.restore();

    expect(wrapper.state().data).to.deep.equal(file.content);
    expect(wrapper.state().openModal).to.equal(false);
  });

  it('Notification dialog is opened when file is not json array', () => {
    const wrapper = shallow(<ImportPage loadEntities={noop} />);
    const file = {
      name: 'valid_object.json',
      type: 'application/json',
      content: {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: 0,
      },
    };

    const stub = sandbox.stub(FileReader.prototype, 'readAsText', function callback() {
      this.onload({ target: { result: JSON.stringify(file.content) } });
    });

    wrapper.find('input').simulate('change', { target: { files: [file] } });

    stub.restore();

    expect(wrapper.state().data).to.deep.equal([]);
    expect(wrapper.state().openModal).to.equal(true);
  });

  it('Shouldn\'t send articles if there are no selected articles on Save', () => {
    const rememberArticles = sandbox.spy();
    const wrapper = shallow(
      <ImportPage
        loadEntities={noop}
        rememberArticles={rememberArticles}
      />
    );
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-03T05:06:09',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-04T05:06:10',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setState({ data, selectedRows: [] });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.called).to.equal(false);
  });

  it('Should send all articles if all articles are selecteled on Save', () => {
    const rememberArticles = sandbox.spy();
    const wrapper = shallow(
      <ImportPage
        loadEntities={noop}
        rememberArticles={rememberArticles}
      />
    );
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-01T05:06:07',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-03T05:06:09',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setState({ data, selectedRows: 'all' });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.getCall(ZERO).args[ZERO]).to.deep.equal({
      articles: Immutable.fromJS(data),
    });
  });

  it('Should send selected articles on Save', () => {
    const rememberArticles = sandbox.spy();
    const wrapper = shallow(
      <ImportPage
        loadEntities={noop}
        rememberArticles={rememberArticles}
      />
    );
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-04T05:06:10',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-01T05:06:07',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setState({ data, selectedRows: [ONE] });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.getCall(ZERO).args[ZERO]).to.deep.equal({
      articles: Immutable.fromJS([data[ONE]]),
    });
  });

  it('Shouldn\'t send selected articles which server already has on Save', () => {
    const rememberArticles = sandbox.spy();
    const wrapper = shallow(
      <ImportPage
        loadEntities={noop}
        rememberArticles={rememberArticles}
      />
    );
    const dataOnServer = [
      {
        id: 1,
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-03T05:06:09',
        read: 0,
      },
      {
        id: 2,
        url: 'https://www.google.com.ua',
      },
    ];
    const data = [
      {
        url: 'http://example.com/',
        title: 'Example Domain',
        timestamp: '2016-01-03T05:06:09',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '2016-01-05T05:06:10',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setProps({ articles: Immutable.fromJS(dataOnServer) });
    wrapper.setState({ data, selectedRows: 'all' });

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.getCall(ZERO).args[ZERO]).to.deep.equal({
      articles: Immutable.fromJS([data[ONE]]),
    });
  });
});
