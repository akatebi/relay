import { Recorder } from '../../Recorder';

describe('Recorder', () => {

  test('mutationInput init', () => {
    const recorder = new Recorder();
    const { mutationInput } = recorder;
    expect(mutationInput).toMatchSnapshot();
  });

  test('onChangeField', () => {
    const recorder = new Recorder();
    const { mutationInput } = recorder;
    for (let id = 0; id < 10; id++) {
      recorder.onChangeField('1-2-3-4', id, id, id + 1);
    }
    expect(mutationInput).toMatchSnapshot();
    expect(recorder.mutationInputDirty()).toBe(true);
    for (let id = 0; id < 10; id++) {
      recorder.onChangeField('1-2-3-4', id, id, id);
    }
    expect(mutationInput).toMatchSnapshot();
    expect(recorder.mutationInputDirty()).toBe(false);
  });

});
