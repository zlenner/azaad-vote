import { DependencyList, useEffect } from 'react'
import useInterval from 'react-use/lib/useInterval'
import { FunctionReturningPromise } from 'react-use/lib/misc/types'
import useAsyncFn from 'react-use/lib/useAsyncFn'

const useAsyncRefresh = <T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  refreshMs: number | null = null
) => {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true
  })

  useInterval(() => {
    callback()
  }, refreshMs)

  useEffect(() => {
    callback()
  }, [callback])

  return state
}
export default useAsyncRefresh
