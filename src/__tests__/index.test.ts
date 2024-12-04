import { findKthLargest } from '../example';
import '@jest/globals';

describe('findKthLargest', () => {
    it('should return the kth largest element', () => {
        expect(findKthLargest({ array: [3, 2, 1, 5, 6, 4, 5], k: 2 })).toBe(5);
    });
});