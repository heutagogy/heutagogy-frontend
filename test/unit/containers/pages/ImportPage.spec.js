/* eslint-disable fp/no-mutation */

import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { ImportPage } from '../../../../src/containers/pages/ImportPage/ImportPage';

const ZERO = 0;
const ONE = 1;
const noop = () => ({});
const saveButtonSelector = '#save-button-import';
const importButtonSelector = '#import-button-import';

describe('Import page tests', () => {
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
          timestamp: '1481630891153',
          read: 0,
        },
        {
          url: 'https://github.com/',
          title: 'How people build software',
          timestamp: '1481630891456',
          read: 1,
        },
      ],
    };

    const stub = sinon.stub(FileReader.prototype, 'readAsText', function callback() {
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
        timestamp: '1481630891153',
        read: 0,
      },
    };

    const stub = sinon.stub(FileReader.prototype, 'readAsText', function callback() {
      this.onload({ target: { result: JSON.stringify(file.content) } });
    });

    wrapper.find('input').simulate('change', { target: { files: [file] } });

    stub.restore();

    expect(wrapper.state().data).to.deep.equal([]);
    expect(wrapper.state().openModal).to.equal(true);
  });

  it('Shouldn\'t send articles if there are no selected articles on Save', () => {
    const rememberArticles = sinon.spy();
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
        timestamp: '1481630891153',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '1481630891456',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setState({ data });
    window.heautagogy.selectedRows = [];

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.called).to.equal(false);
  });

  it('Should send all articles if all articles are selecteled on Save', () => {
    const rememberArticles = sinon.spy();
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
        timestamp: '1481630891153',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '1481630891456',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setState({ data });
    window.heautagogy.selectedRows = ['all'];

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.getCall(ZERO).args[ZERO]).to.deep.equal({
      articles: Immutable.fromJS(data),
    });
  });

  it('Should send selected articles on Save', () => {
    const rememberArticles = sinon.spy();
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
        timestamp: '1481630891153',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '1481630891456',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setState({ data });
    window.heautagogy.selectedRows = [ONE];

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.getCall(ZERO).args[ZERO]).to.deep.equal({
      articles: Immutable.fromJS([data[ONE]]),
    });
  });

  it('Should not send selected articles which already on server on Save', () => {
    const rememberArticles = sinon.spy();
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
        timestamp: '1481630891153',
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
        timestamp: '1481630891153',
        read: 0,
      },
      {
        url: 'https://github.com/',
        title: 'How people build software',
        timestamp: '1481630891456',
        read: 1,
      },
      {
        url: 'https://www.google.com.ua',
      },
    ];

    wrapper.setProps({ articles: Immutable.fromJS(dataOnServer) });
    wrapper.setState({ data });
    window.heautagogy.selectedRows = ['all'];

    wrapper.find(saveButtonSelector).simulate('click');

    expect(rememberArticles.getCall(ZERO).args[ZERO]).to.deep.equal({
      articles: Immutable.fromJS([data[ONE]]),
    });
  });
});
