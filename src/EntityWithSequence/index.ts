import { getConnection, getManager } from 'typeorm'

export class EntityWithSequence {
  public async __beforeInsert(): Promise<void> {
    const className = (this as Object).constructor.name
    const entities = getConnection().entityMetadatas
    for (const entity of entities) {
      if (entity.name === className) {
        for (const col of entity.columns) {
          const metadata = Reflect.getMetadataKeys(this, col.propertyName)
          if (metadata.includes('nextVal')) {
            const sequenceName = Reflect.getMetadata('sequenceName', this, col.propertyName)
            const columnName = Reflect.getMetadata('column', this, col.propertyName)
            const nextVal = await getManager().query(`select nextval('${sequenceName}') as id`)
            this[columnName] = nextVal[0].id
          }
        }
        break
      }
    }
  }
}
