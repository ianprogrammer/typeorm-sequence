import { getConnection, getManager } from 'typeorm'


class DatabaseTypeNotSupported extends Error {
  constructor() {
    super("Database type is not supported"); // (1)
    this.name = "DatabaseTypeNotSupported"; // (2)
  }
}

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
            let query = ""

            if (getConnection().options.type == "postgres") {
              query = `select nextval('${sequenceName}') as id`
            } else if (getConnection().options.type == "oracle") {
              query = `SELECT ${sequenceName}.NEXTVAL FROM DUAL;`
            } else {
              throw new DatabaseTypeNotSupported()
            }

            const nextVal = await getManager().query(query)
            this[columnName] = nextVal[0].id
          }
        }
        break
      }
    }
  }
}
