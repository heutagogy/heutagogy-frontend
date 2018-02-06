import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import { HeaderBar } from './../../../src/containers/HeaderBar/HeaderBar';

describe('HeaderBar tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Input file accepts only json', () => {
    const wrapper = shallow(<HeaderBar user={Immutable.fromJS({})} />);

    wrapper.setState({ openMenu: true });

    expect(wrapper.find('input[type="file"]').html()).to.contain('accept=".json"');
  });

  it('Data is set when uploading file is valid json array', () => {
    const wrapper = shallow(<HeaderBar user={Immutable.fromJS({})} />);
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

    wrapper.setState({ openMenu: true });
    wrapper.find('input').simulate('change', { target: { files: [file] } });

    stub.restore();

    expect(wrapper.state().articlesToImport).to.deep.equal(Immutable.fromJS(file.content));
    expect(wrapper.state().openImport).to.equal(true);
  });
});
