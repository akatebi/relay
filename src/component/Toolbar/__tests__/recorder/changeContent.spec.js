import { Recorder } from '../../Recorder';

describe('Recorder', () => {

  test('onChangeContent', () => {
    const recorder = new Recorder();
    const { mutationInput } = recorder;
    for (let i = 0; i < 10; i++) {
      const object = { id: `${i}`, valueVM: i, value: i, propertyType: `Number${i}` };
      recorder.onChangeContent('customProperties', object);
      recorder.onChangeContent('identities', object);
    }
    expect(mutationInput).toMatchSnapshot();
    expect(recorder.mutationInputDirty()).toBe(false);
    for (let i = 0; i < 10; i++) {
      const object = { id: `${i}`, valueVM: i, value: i + 1, propertyType: `Number${i}` };
      recorder.onChangeContent('customProperties', object);
      recorder.onChangeContent('identities', object);
    }
    expect(mutationInput).toMatchSnapshot();
    expect(recorder.mutationInputDirty()).toBe(true);
    for (let i = 0; i < 10; i++) {
      const object = { id: `${i}`, valueVM: i + 1, value: i + 1, propertyType: `Number${i}` };
      recorder.onChangeContent('customProperties', object);
      recorder.onChangeContent('identities', object);
    }
    expect(mutationInput).toMatchSnapshot();
    expect(recorder.mutationInputDirty()).toBe(false);
  });

});
