# Dynamo1

<p>
  <a href="https://github.com/wan2land/dynamo1/actions?query=workflow%3A%22Node.js+CI%22"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/dynamo1/Node.js%20CI?logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/dynamo1?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/dynamo1.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/dynamo1"><img alt="Version" src="https://img.shields.io/npm/v/dynamo1.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/dynamo1"><img alt="License" src="https://img.shields.io/npm/l/dynamo1.svg?style=flat-square" /></a>
  <img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
  <a href="https://david-dm.org/wan2land/dynamo1"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/dynamo1.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/wan2land/dynamo1?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/dynamo1.svg?style=flat-square" /></a>
</p>

With Dynamo DB, only one table is enough.

Dynamo DB one table ORM for Javascript(& Typescript).


## Installation

## Usage

```typescript

const connection = createConnection([
  {
    tableName: `${STAGE}-datas`,
    aliasName: 'datas',
    hashKey: { name: string, type: Buffer },
    rangeKey: { name: string, type: String },
    gsi: [
      { name: 'gsi1', hashKey: { name: string, type: String }, rangeKey: { name: string, type: String } },
      { name: 'gsi2', hashKey: { name: string, type: String }, rangeKey: { name: string, type: String } },
      { name: 'gsi3', hashKey: { name: string, type: String }, rangeKey: { name: string, type: String } },
    ],
  }, // tables[0] is default
])

```

### Entity


```typescript
import { v4 as uuid } from 'uuid'

import { Column, Entity, column, text } from 'dynamo1'

@Entity<User>({
  name: 'users',
  hashKey: text('users'),
  rangeKey: column('id'),
})
export class User {
  @Column({ name: 'user_id', onCreate: _ => uuid() })
  public id!: string

  @Column()
  public username?: string

  @Column()
  public email!: string

  @Column<User>({
    onCreate: entity => entity.createdAt || new Date().getTime(),
  })
  public createdAt!: number

  @Column<User>({
    onCreate: _ => new Date().getTime(),
    onUpdate: _ => new Date().getTime(),
  })
  public updatedAt!: number
}
```

## Todo

- [x] Add GSI support to findOne, findMany in Repository
- [x] Add QueryBuilder, Repository createQueryBuilder method
- [ ] Add Connection scan method
- [ ] Add Repository count method
- [ ] Logging
- [ ] Index Full Type (buffer, string, number)
- [ ] Add Connection updateItem method
- [ ] Update Expression Builder (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html)
- [ ] Multi tables
- [ ] Define custom error types
