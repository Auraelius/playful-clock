import { invalidDisplayJobData } from '../arduinix/invalid-display-job-data.js';

describe('checking worker', function () {
  describe('checking invalidDisplayJobData', function () {
    beforeEach(() => {
      process.env.NUMBER_OF_TUBES = 8;
    });
    it('should catch two missing properties', function () {
      const testData = {};
      expect(invalidDisplayJobData(testData)).to.be.true;
    });

    it('should catch one missing property', function () {
      const testData = {};
      testData.digits = '4444';
      expect(invalidDisplayJobData(testData)).to.be.true;
    });

    it('should catch the other missing property', function () {
      const testData = {};
      testData.brightness = '4444';
      expect(invalidDisplayJobData(testData)).to.be.true;
    });

    it('should catch non-string property values', function () {
      const testData = {};
      testData.brightness = 99999999;
      expect(invalidDisplayJobData(testData)).to.be.true;
      testData.digits = 12345678;
      expect(invalidDisplayJobData(testData)).to.be.true;
    });

    it('should detect when the length of strings is greater than the number of tubes', function () {
      const testData = { brightness: '99999999', digits: '12345678' };
      process.env.NUMBER_OF_TUBES = 6;
      expect(invalidDisplayJobData(testData)).to.be.true;
    });

    it('should detect when the length of strings is less than the number of tubes', function () {
      const testData = { brightness: '9999', digits: '1278' };
      process.env.NUMBER_OF_TUBES = 8;
      expect(invalidDisplayJobData(testData)).to.be.true;
    });

    it('should check for invalid digits', function () {
      const testData = { brightness: '00000000', digits: '00000000' };
      expect(invalidDisplayJobData(testData)).to.be.false;
    });
  });
});
