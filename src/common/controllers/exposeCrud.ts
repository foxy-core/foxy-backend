import { flow } from 'fp-ts/lib/function'
import { Crud, CrudMethod, CrudMethodName } from '@/base/useTable/types'
import { ControllerRegisterer } from '@/types/controllerRelated.types'
import { AddListenerFunction } from '@/types/listenerRelated.types'

export const exposeCrud =
  (
    store: Crud<any, any>,
    exposedMethods?: CrudMethodName[],
  ): ControllerRegisterer<undefined> =>
  (addListener: AddListenerFunction) => {
    ;(Object.entries(store) as [CrudMethodName, CrudMethod][])
      .filter(([name]) => !name.includes('find'))
      .filter(([name]) =>
        exposedMethods?.length ? exposedMethods.includes(name) : true,
      )
      .forEach(([methodName, method]) =>
        addListener(
          methodName,
          resolve => data =>
            flow(method.bind(store, ...data), result => resolve(result)),
        ),
      )
  }
