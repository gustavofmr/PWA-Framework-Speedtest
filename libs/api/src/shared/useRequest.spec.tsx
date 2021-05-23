import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useRequest } from './useRequest';

describe('useRequest', () => {
  it('should return initial state at init', () => {
    const { result } = renderHook(() => useRequest());

    expect(result.current.state).toEqual({
      data: null,
      loading: false,
      error: false,
    });
  });

  describe('load action', () => {
    it('should set loading to true', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.load();
      });

      expect(result.current.state).toEqual({
        data: null,
        loading: true,
        error: false,
      });
    });

    it('should only reset error', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.reqSuccess('test');
        result.current.reqError('err');
        result.current.load();
      });

      expect(result.current.state).toEqual({
        data: 'test',
        loading: true,
        error: false,
      });
    });
  });

  describe('success action', () => {
    it('should set data', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.reqSuccess('test');
      });

      expect(result.current.data).toEqual('test');
    });

    it('should set loading to true', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.load();
        result.current.reqSuccess('test');
      });

      expect(result.current.loading).toEqual(false);
    });

    it('should set error to false', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.reqError('err');
        result.current.reqSuccess('test');
      });

      expect(result.current.error).toEqual(false);
    });
  });

  describe('error action', () => {
    it('should set error', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.reqError('err');
      });

      expect(result.current.error).toEqual('err');
    });

    it('should set loading to false', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.load();
        result.current.reqError('err');
      });

      expect(result.current.loading).toEqual(false);
    });

    it('should leave data intact', () => {
      const { result } = renderHook(() => useRequest());

      act(() => {
        result.current.reqSuccess('test');
        result.current.reqError('err');
      });

      expect(result.current.data).toEqual('test');
    });
  });
});
