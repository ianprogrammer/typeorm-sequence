/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata'
import { getMetadataArgsStorage } from 'typeorm'
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes'

export const NextVal = (sequenceName: string) => {
  return function (object: Object, propertyName: string) {
    Reflect.defineMetadata('nextVal', 'nextVal', object, propertyName)
    Reflect.defineMetadata('sequenceName', sequenceName, object, propertyName)
    Reflect.defineMetadata('column', propertyName, object, propertyName)
    Reflect.defineMetadata('entityName', object.constructor.name, object, propertyName)
    getMetadataArgsStorage().entityListeners.push({
      target: object.constructor,
      propertyName: '__beforeInsert',
      type: EventListenerTypes.BEFORE_INSERT
    })
  }
}
