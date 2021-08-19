import { useAsync } from "utils/use-async";
import { act, renderHook } from "@testing-library/react-hooks";

const defaultState: ReturnType<typeof useAsync> = {
  stat: "idle",
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
};

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "loading",
  isIdle: false,
  isLoading: true,
};

const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "success",
  isIdle: false,
  isSuccess: true,
};

test("useAsync可以异步处理状态", async () => {
  let resolve: any, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  //测试初始状态
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  //测试loading状态
  let p: Promise<any>;
  //act包装,接收异步操作返回值
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);
  //测试success状态
  const resolvedValue = { mockedValue: "resolved" };
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  });
});
