import { Recorder } from '../../../Recorder';

describe('Recorder changeConfig', () => {

  test('defaultValue', () => {

    const recorder = new Recorder();
    const { mutationInput } = recorder;

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'defaultValue', 'Boolean', true, false);
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'defaultValue', 'Boolean', false, false);
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'defaultValue', 'Category', { a: 1 }, { a: 2 });
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'defaultValue', 'Category', { a: 2 }, { a: 2 });
    }
    expect(mutationInput).toMatchSnapshot();

  });

});
