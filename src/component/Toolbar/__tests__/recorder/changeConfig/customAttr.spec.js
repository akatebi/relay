import { Recorder } from '../../../Recorder';

describe('Recorder changeConfig', () => {

  test('customAttributes', () => {

    const recorder = new Recorder();
    const { mutationInput } = recorder;

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'customAttributes', 'name', 'Boolean', true, false);
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'customAttributes', 'name', 'Boolean', false, false);
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'customAttributes', 'name', 'Category', { a: 1 }, { b: 1 });
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 4; id++) {
      recorder.onChangeConfig(id, 'customAttributes', 'name', 'Category', { a: 1 }, { a: 1 });
    }
    expect(mutationInput).toMatchSnapshot();

  });

});
