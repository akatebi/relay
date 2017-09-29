import { Recorder } from '../../../Recorder';

describe('Recorder onChangeConfig', () => {

  test('propertyLabel', () => {

    const recorder = new Recorder();
    const { mutationInput } = recorder;

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'propertyLabel', 'cultureCode', 'en-US', 'en-UK');
      recorder.onChangeConfig(id, 'propertyLabel', 'value', 'v1', 'v2');
    }
    expect(mutationInput).toMatchSnapshot();

    for (let id = 0; id < 2; id++) {
      recorder.onChangeConfig(id, 'propertyLabel', 'cultureCode', 'en-US', 'en-US');
      recorder.onChangeConfig(id, 'propertyLabel', 'value', 'v1', 'v1');
    }
    expect(mutationInput).toMatchSnapshot();

  });

});
