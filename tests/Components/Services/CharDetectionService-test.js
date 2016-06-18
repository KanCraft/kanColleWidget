// TODO: これ、recursiveにunmockできないかな
jest.unmock('../../../src/js/Components/Services/CharDetectionService');
jest.unmock('../../../src/js/Components/Services/CharDetectionService/Implements');
jest.unmock('../../../src/js/Components/Services/CharDetectionService/Implements/OCRServerClient');

import CharDetectionService, {
  BASE64SAMPLE
} from '../../../src/js/Components/Services/CharDetectionService';

describe("CharDetectionService", () => {
  it("hoge", () => {
    expect(true).toBeTruthy();
    const service = new CharDetectionService();
    return service.fromBase64(BASE64SAMPLE).then(res => {
      expect(res.result).toBe('03:00:00');
    })
  })
})
