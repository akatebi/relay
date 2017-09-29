import { Recorder } from '../../../Recorder';

describe('Recorder onChangeConfig', () => {

  test('simple props', () => {

    const recorder = new Recorder();
    const { mutationInput } = recorder;
    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'url', 'old value', 'new value');
      recorder.onChangeConfig(id, 'group', 'old value', 'new value');
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'url', 'same value', 'same value');
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'group', 'same value', 'same value');
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      const validations = i => [
        {
          type: 'Required',
          messageText: `messageText-${i}`,
          regexp: 'regexp',
        },
        {
          type: 'Valid',
          messageText: `messageText-${i}`,
          regexp: 'regexp',
        },
      ];
      recorder.onChangeConfig(id, 'validations', validations(id), validations(id + 1));
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      const validations = i => [
        {
          type: 'Required',
          messageText: `messageText-${i}`,
          regexp: 'regexp',
        },
        {
          type: 'Valid',
          messageText: `messageText-${i}`,
          regexp: 'regexp',
        },
      ];
      recorder.onChangeConfig(id, 'validations', validations(id), validations(id));
    }
    expect(mutationInput).toMatchSnapshot();

  });

});
